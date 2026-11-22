/** Public API for the internationalization feature. */
export {
  LANGUAGE_STORAGE_KEY,
  LanguageProvider,
  useI18n,
} from './LanguageProvider';

export {
  LANGUAGE_LABELS,
  LOCALES,
  SUPPORTED_LANGUAGES,
} from './locales';

export type {
  Language,
  LocaleDictionary,
  LocaleMessages,
  ThemeTranslations,
  TranslationKey,
} from './locales';
