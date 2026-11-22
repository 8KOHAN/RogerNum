import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

export const PREFERENCES_STORAGE_KEY = 'roger-num:preferences';

export interface UserPreferences {
  multipleNumbersEnabled: boolean;
}

interface PreferencesContextValue extends UserPreferences {
  setMultipleNumbersEnabled: (enabled: boolean) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  multipleNumbersEnabled: false,
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function parsePreferences(serializedPreferences: string | null): UserPreferences {
  if (serializedPreferences === null) {
    return DEFAULT_PREFERENCES;
  }

  try {
    const parsed: unknown = JSON.parse(serializedPreferences);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'multipleNumbersEnabled' in parsed &&
      typeof parsed.multipleNumbersEnabled === 'boolean'
    ) {
      return { multipleNumbersEnabled: parsed.multipleNumbersEnabled };
    }
  } catch {
    // Invalid stored data falls back to the default preferences.
  }

  return DEFAULT_PREFERENCES;
}

function readInitialPreferences(): UserPreferences {
  try {
    return parsePreferences(localStorage.getItem(PREFERENCES_STORAGE_KEY));
  } catch {
    // Preferences remain usable for the current session without storage access.
    return DEFAULT_PREFERENCES;
  }
}

export function PreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<UserPreferences>(
    readInitialPreferences,
  );

  const setMultipleNumbersEnabled = useCallback((enabled: boolean) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      multipleNumbersEnabled: enabled,
    }));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(preferences),
      );
    } catch {
      // The current preference still works if persistent storage is unavailable.
    }
  }, [preferences]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === PREFERENCES_STORAGE_KEY) {
        setPreferences(parsePreferences(event.newValue));
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...preferences,
      setMultipleNumbersEnabled,
    }),
    [preferences, setMultipleNumbersEnabled],
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
