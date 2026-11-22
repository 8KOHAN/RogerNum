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
  PREFERENCES_STORAGE_KEY,
  subscribeToUserSettings,
  updateUserSettings,
} from '../settings';

export { PREFERENCES_STORAGE_KEY };

export interface UserPreferences {
  multipleNumbersEnabled: boolean;
}

interface PreferencesContextValue extends UserPreferences {
  setMultipleNumbersEnabled: (enabled: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [multipleNumbersEnabled, setMultipleNumbersEnabledState] =
    useState<boolean>(() => getInitialUserSettings().multipleNumbersEnabled);
  const userChangedPreference = useRef(false);
  const receivedStoredPreference = useRef(false);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = subscribeToUserSettings((patch) => {
      if (patch.multipleNumbersEnabled !== undefined) {
        receivedStoredPreference.current = true;
        setMultipleNumbersEnabledState(patch.multipleNumbersEnabled);
      }
    });

    void getUserSettings()
      .then((settings) => {
        if (
          isActive &&
          !userChangedPreference.current &&
          !receivedStoredPreference.current
        ) {
          setMultipleNumbersEnabledState(settings.multipleNumbersEnabled);
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

  const setMultipleNumbersEnabled = useCallback((enabled: boolean) => {
    userChangedPreference.current = true;
    setMultipleNumbersEnabledState(enabled);

    void updateUserSettings({ multipleNumbersEnabled: enabled }).catch(() => {
      // The preference remains available for the current session.
    });
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({ multipleNumbersEnabled, setMultipleNumbersEnabled }),
    [multipleNumbersEnabled, setMultipleNumbersEnabled],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);

  if (context === null) {
    throw new Error('usePreferences must be used within a PreferencesProvider.');
  }

  return context;
}
