export const THEMES = {
  light: {
    label: 'Light',
    description: 'Clean and minimal',
    swatch: '#6B7280',
    brandSubtitle: 'RANDOM NUMBER GENERATOR',
    resultLabel: 'GENERATED NUMBER',
    editionLabel: 'MINIMAL EDITION',
  },
  dark: {
    label: 'Dark',
    description: 'Quiet graphite',
    swatch: '#9CA3AF',
    brandSubtitle: 'RANDOM NUMBER GENERATOR',
    resultLabel: 'YOUR RESULT',
    editionLabel: 'DARK EDITION',
  },
  gold: {
    label: 'Gold',
    description: 'Warm and premium',
    swatch: '#D7A84A',
    brandSubtitle: 'THE GOLDEN GENERATOR',
    resultLabel: 'YOUR GOLDEN NUMBER',
    editionLabel: 'GOLD EDITION',
  },
  ocean: {
    label: 'Ocean',
    description: 'Cool teal tones',
    swatch: '#4DC7D5',
    brandSubtitle: 'OCEAN NUMBER LAB',
    resultLabel: 'NUMBER DISCOVERED',
    editionLabel: 'OCEAN EDITION',
  },
  forest: {
    label: 'Forest',
    description: 'Natural green tones',
    swatch: '#7CCB8E',
    brandSubtitle: 'NATURAL RANDOMNESS',
    resultLabel: 'YOUR RANDOM NUMBER',
    editionLabel: 'FOREST EDITION',
  },
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
