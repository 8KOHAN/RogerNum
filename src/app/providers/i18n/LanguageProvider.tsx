import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  getInitialUserSettings,
  getUserSettings,
  subscribeToUserSettings,
  updateUserSettings,
} from '../settings';
import {
  LANGUAGE_LABELS,
  LOCALES,
  SUPPORTED_LANGUAGES,
  type Language,
  type ThemeTranslations,
  type TranslationKey,
} from './locales';
import type { Theme } from '../theme/themes';

export { LANGUAGE_LABELS, SUPPORTED_LANGUAGES };
export { LANGUAGE_STORAGE_KEY } from '../settings';
export type { Language, TranslationKey };

type TranslationValues = Record<string, string | number>;
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
  themeText: Record<Theme, ThemeTranslations>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolateMessage(
  message: string,
  values?: TranslationValues,
): string {
  return message.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    const value = values?.[name];
    return value === undefined ? placeholder : String(value);
  });
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(
    () => getInitialUserSettings().language,
  );
  const userChangedLanguage = useRef(false);
  const receivedStoredLanguage = useRef(false);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = subscribeToUserSettings((patch) => {
      if (patch.language !== undefined) {
        receivedStoredLanguage.current = true;
        setLanguageState(patch.language);
      }
    });

    void getUserSettings()
      .then((settings) => {
        if (
          isActive &&
          !userChangedLanguage.current &&
          !receivedStoredLanguage.current
        ) {
          setLanguageState(settings.language);
        }
      })
      .catch(() => {
        // Keep the synchronous bootstrap value if persistent storage is unavailable.
      });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      // Persist the choice even when it matches the current browser language.
      // This makes an explicit selection take priority over future browser changes.
      userChangedLanguage.current = true;
      setLanguageState(nextLanguage);

      void updateUserSettings({ language: nextLanguage }).catch(() => {
        // The selected language remains available for the current session.
      });
    },
    [],
  );

  useEffect(() => {
    document.documentElement.lang = language.replace('_', '-');
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback(
    (key: TranslationKey, values?: TranslationValues) =>
      interpolateMessage(LOCALES[language].messages[key], values),
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      themeText: LOCALES[language].themes,
    }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error('useI18n must be used within a LanguageProvider.');
  }
  return context;
}
