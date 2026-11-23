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
  getStoredTheme,
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
  const hasExplicitTheme = useRef(false);

  useEffect(() => {
    let isActive = true;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const unsubscribe = subscribeToUserSettings((patch) => {
      if (patch.theme !== undefined) {
        hasExplicitTheme.current = true;
        receivedStoredTheme.current = true;
        setThemeState(patch.theme);
      }
    });

    void Promise.all([getUserSettings(), getStoredTheme()])
      .then(([, storedTheme]) => {
        hasExplicitTheme.current = storedTheme !== null;
        if (isActive && !userChangedTheme.current && !receivedStoredTheme.current) {
          setThemeState(storedTheme ?? (mediaQuery.matches ? 'dark' : 'light'));
        }
      })
      .catch(() => {
        // Keep the synchronous bootstrap value if persistent storage is unavailable.
      });

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (!hasExplicitTheme.current && !userChangedTheme.current) {
        setThemeState(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      isActive = false;
      unsubscribe();
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      userChangedTheme.current = true;
      hasExplicitTheme.current = true;
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

