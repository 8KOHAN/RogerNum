export const THEMES = {
  light: { swatch: '#6B7280' },
  dark: { swatch: '#9CA3AF' },
  gold: { swatch: '#D7A84A' },
  ocean: { swatch: '#4DC7D5' },
  forest: { swatch: '#7CCB8E' },
} as const;

export type Theme = keyof typeof THEMES;

export const THEME_IDS = Object.keys(THEMES) as Theme[];

export const DEFAULT_THEME: Theme = 'light';

export const THEME_STORAGE_KEY = 'roger-num:theme';

export function isTheme(value: unknown): value is Theme {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(THEMES, value)
  );
}
