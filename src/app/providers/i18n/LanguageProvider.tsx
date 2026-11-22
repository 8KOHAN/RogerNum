import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

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
export type { Language, TranslationKey };

export const LANGUAGE_STORAGE_KEY = 'roger-num:language';

type TranslationValues = Record<string, string | number>;
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: TranslationValues) => string;
  themeText: Record<Theme, ThemeTranslations>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: unknown): value is Language {
  return (
    typeof value === 'string' &&
    SUPPORTED_LANGUAGES.includes(value as Language)
  );
}

function getBrowserLanguage(): Language {
  const browserLanguage =
    typeof navigator === 'undefined' ? '' : navigator.language.toLowerCase();

  return browserLanguage.startsWith('uk') ? 'uk' : 'en';
}

function readInitialLanguage(): Language {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    // Fall back to the browser language when persistent storage is unavailable.
  }

  return getBrowserLanguage();
}

function persistLanguage(language: Language): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Language selection remains available for the current session.
  }
}

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
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback(
    (key: TranslationKey, values?: TranslationValues) =>
      interpolateMessage(LOCALES[language].messages[key], values),
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language;
    persistLanguage(language);
  }, [language]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === LANGUAGE_STORAGE_KEY) {
        setLanguageState(
          isLanguage(event.newValue) ? event.newValue : getBrowserLanguage(),
        );
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
