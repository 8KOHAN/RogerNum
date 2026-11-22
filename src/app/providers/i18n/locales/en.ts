import type { Theme } from '../../theme/themes';

/** English source of truth for translation keys and locale shape. */
export const en = {
  messages: {
    'app.subtitle': 'RANDOM NUMBER GENERATOR',
    'menu.moreOptions': 'More options',
    'menu.open': 'Open RogerNum menu',
    'menu.ariaLabel': 'RogerNum options',
    'menu.appearance': 'Appearance',
    'menu.settings': 'Settings',
    'menu.githubRepository': 'GitHub repository',
    'theme.appearance': 'Appearance',
    'theme.chooseInterfaceTheme': 'Choose interface theme',
    'theme.currentTheme': 'Theme: {theme}',
    'theme.chooseThemeCurrent': 'Choose interface theme. Current theme: {theme}',
    'language.label': 'Language',
    'language.description': 'Choose the language used across RogerNum.',
    'language.selectLabel': 'Interface language',
    'generator.title': 'Number generator',
    'generator.from': 'From',
    'generator.to': 'To',
    'generator.minimum': 'Minimum',
    'generator.maximum': 'Maximum',
    'generator.increaseMinimum': 'Increase minimum value',
    'generator.decreaseMinimum': 'Decrease minimum value',
    'generator.increaseMaximum': 'Increase maximum value',
    'generator.decreaseMaximum': 'Decrease maximum value',
    'generator.resultWillAppear': 'Your result will appear here',
    'generator.resultRange': 'From {from} to {to}',
    'generator.count': 'Number of results',
    'generator.increaseCount': 'Increase number of results',
    'generator.decreaseCount': 'Decrease number of results',
    'generator.resultsCount': '{count} numbers generated',
    'generator.generate': 'Generate number',
    'generator.generateNumbers': 'Generate numbers',
    'generator.copyAll': 'Copy all',
    'generator.copied': 'Copied',
    'generator.copyFailed': 'Copy failed. Try again.',
    'generator.error.emptyBounds': 'Enter both minimum and maximum values.',
    'generator.error.invalidInteger': 'Enter valid integers within the safe number range.',
    'generator.error.minimumExceedsMaximum': 'The minimum value cannot exceed the maximum.',
    'generator.error.rangeTooLarge': 'The selected range is too large.',
    'generator.error.invalidCount': 'Choose a number of results between 1 and {max}.',
    'settings.documentTitle': 'RogerNum Settings',
    'settings.badge': 'SETTINGS',
    'settings.eyebrow': 'EXTENSION PREFERENCES',
    'settings.title': 'Settings',
    'settings.description': 'Personalize your RogerNum experience.',
    'settings.personalization': 'PERSONALIZATION',
    'settings.generatorFeatures': 'GENERATOR FEATURES',
    'settings.multipleNumbersTitle': 'Generate multiple numbers',
    'settings.multipleNumbersDescription': 'Adds a quantity field. Generate up to 100 numbers in one request.',
    'settings.multipleNumbersToggle': 'Enable multiple-number generation',
    'settings.themeDescription': 'Choose the color theme used across RogerNum.',
    'settings.selectedTheme': 'Current theme: {theme}',
    'settings.themeSavedAutomatically': 'Your appearance preference is saved automatically.',
    'settings.savedAutomatically': 'Changes are saved automatically',
  },
  themes: {
    light: {
      label: 'Light',
      description: 'Clean and minimal',
      brandSubtitle: 'RANDOM NUMBER GENERATOR',
      resultLabel: 'GENERATED NUMBER',
      resultsLabel: 'GENERATED NUMBERS',
      editionLabel: 'MINIMAL EDITION',
    },
    dark: {
      label: 'Dark',
      description: 'Quiet graphite',
      brandSubtitle: 'RANDOM NUMBER GENERATOR',
      resultLabel: 'YOUR RESULT',
      resultsLabel: 'YOUR RESULTS',
      editionLabel: 'DARK EDITION',
    },
    gold: {
      label: 'Gold',
      description: 'Warm and premium',
      brandSubtitle: 'THE GOLDEN GENERATOR',
      resultLabel: 'YOUR GOLDEN NUMBER',
      resultsLabel: 'YOUR GOLDEN NUMBERS',
      editionLabel: 'GOLD EDITION',
    },
    ocean: {
      label: 'Ocean',
      description: 'Cool teal tones',
      brandSubtitle: 'OCEAN NUMBER LAB',
      resultLabel: 'NUMBERS DISCOVERED',
      resultsLabel: 'NUMBERS DISCOVERED',
      editionLabel: 'OCEAN EDITION',
    },
    forest: {
      label: 'Forest',
      description: 'Natural green tones',
      brandSubtitle: 'NATURAL RANDOMNESS',
      resultLabel: 'YOUR RANDOM NUMBER',
      resultsLabel: 'YOUR RANDOM NUMBERS',
      editionLabel: 'FOREST EDITION',
    },
  },
} as const;

export type TranslationKey = keyof typeof en.messages;
export type ThemeTranslations = {
  [Key in keyof (typeof en.themes)['light']]: string;
};
export type LocaleMessages = {
  [Key in TranslationKey]: string;
};
export type LocaleDictionary = {
  messages: LocaleMessages;
  themes: Record<Theme, ThemeTranslations>;
};
