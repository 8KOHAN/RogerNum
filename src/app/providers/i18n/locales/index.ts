import { en } from './en';
import { uk } from './uk';
import type { LocaleDictionary } from './en';

export const SUPPORTED_LANGUAGES = ['en', 'uk'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Keep language names in their native form in the language selector. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  uk: 'Українська',
};

/** All supported translations, keyed by their language code. */
export const LOCALES: Record<Language, LocaleDictionary> = {
  en,
  uk,
};

export type {
  LocaleDictionary,
  LocaleMessages,
  ThemeTranslations,
  TranslationKey,
} from './en';
