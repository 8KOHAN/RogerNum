import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
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
import type { Theme } from './themes';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(
    () => getInitialUserSettings().theme,
  );
  const userChangedTheme = useRef(false);
  const receivedStoredTheme = useRef(false);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = subscribeToUserSettings((patch) => {
      if (patch.theme !== undefined) {
        receivedStoredTheme.current = true;
        setThemeState(patch.theme);
      }
    });

    void getUserSettings()
      .then((settings) => {
        if (
          isActive &&
          !userChangedTheme.current &&
          !receivedStoredTheme.current
        ) {
          setThemeState(settings.theme);
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

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      if (nextTheme === theme) {
        return;
      }

      userChangedTheme.current = true;
      document.documentElement.dataset.themeChanging = 'true';
      setThemeState(nextTheme);

      void updateUserSettings({ theme: nextTheme }).catch(() => {
        // The selected theme remains available for the current session.
      });
    },
    [theme],
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;

    const frameId = requestAnimationFrame(() => {
      delete root.dataset.themeChanging;
    });

    return () => cancelAnimationFrame(frameId);
  }, [theme]);

  const contextValue = useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }

  return context;
}

