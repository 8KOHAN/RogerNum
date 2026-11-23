import { ar } from './ar';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { ja } from './ja';
import { ko } from './ko';
import { pt_BR } from './pt_BR';
import { ru } from './ru';
import { uk } from './uk';
import { zh_CN } from './zh_CN';
import type { LocaleDictionary } from './en';

export const SUPPORTED_LANGUAGES = [
  'en',
  'uk',
  'es',
  'de',
  'fr',
  'pt_BR',
  'ja',
  'zh_CN',
  'ko',
  'ru',
  'ar',
  'it',
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** Language names are displayed in their native form. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  uk: 'Українська',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  pt_BR: 'Português (Brasil)',
  ja: '日本語',
  zh_CN: '简体中文',
  ko: '한국어',
  ru: 'Русский',
  ar: 'العربية',
  it: 'Italiano',
};

/** All supported translations, keyed by their language code. */
export const LOCALES: Record<Language, LocaleDictionary> = {
  en,
  uk,
  es,
  de,
  fr,
  pt_BR,
  ja,
  zh_CN,
  ko,
  ru,
  ar,
  it,
};

export type {
  LocaleDictionary,
  LocaleMessages,
  ThemeTranslations,
  TranslationKey,
} from './en';
