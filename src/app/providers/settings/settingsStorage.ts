import { browser } from 'wxt/browser';

import {
  DEFAULT_THEME,
  isTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from '../theme/themes';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/locales';

export const LANGUAGE_STORAGE_KEY = 'roger-num:language';
const LANGUAGE_MANUAL_STORAGE_KEY = 'roger-num:language-manual';
export const PREFERENCES_STORAGE_KEY = 'roger-num:preferences';
export const MULTIPLE_NUMBERS_ENABLED_STORAGE_KEY =
  'roger-num:multiple-numbers-enabled';
export const RANGE_MIN_STORAGE_KEY = 'roger-num:range-min';
export const RANGE_MAX_STORAGE_KEY = 'roger-num:range-max';
export const NUMBER_COUNT_STORAGE_KEY = 'roger-num:number-count';

export const USER_SETTINGS_STORAGE_KEYS = {
  theme: THEME_STORAGE_KEY,
  language: LANGUAGE_STORAGE_KEY,
  multipleNumbersEnabled: MULTIPLE_NUMBERS_ENABLED_STORAGE_KEY,
  rangeMin: RANGE_MIN_STORAGE_KEY,
  rangeMax: RANGE_MAX_STORAGE_KEY,
  numberCount: NUMBER_COUNT_STORAGE_KEY,
} as const;

const STORAGE_KEY_LIST = [
  ...Object.values(USER_SETTINGS_STORAGE_KEYS),
  LANGUAGE_MANUAL_STORAGE_KEY,
];

type StorageRecord = Record<string, unknown>;

export interface UserSettings {
  theme: Theme;
  language: Language;
  multipleNumbersEnabled: boolean;
  rangeMin: string;
  rangeMax: string;
  numberCount: string;
}

export type UserSettingsPatch = Partial<UserSettings>;
export type UserSettingsChangeListener = (patch: UserSettingsPatch) => void;

const changeListeners = new Set<UserSettingsChangeListener>();

let initializationPromise: Promise<void> | null = null;
let writeQueue: Promise<void> = Promise.resolve();
let storageListenerRegistered = false;

function getSystemTheme(): Theme {
  try {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function getBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const browserLanguages = [
    ...(navigator.languages ?? []),
    navigator.language,
  ];

  for (const browserLanguage of browserLanguages) {
    const normalizedLanguage = browserLanguage
      .replaceAll('_', '-')
      .toLowerCase();
    const languageCode = normalizedLanguage.split('-')[0];

    switch (languageCode) {
      case 'en':
        return 'en';
      case 'uk':
        return 'uk';
      case 'es':
        return 'es';
      case 'de':
        return 'de';
      case 'fr':
        return 'fr';
      case 'pt':
        return 'pt_BR';
      case 'ja':
        return 'ja';
      case 'zh':
        if (/(?:^|[-_])(tw|hk|mo|hant)(?:$|[-_])/.test(normalizedLanguage)) {
          break;
        }
        return 'zh_CN';
      case 'ko':
        return 'ko';
      case 'ru':
        return 'ru';
      case 'ar':
        return 'ar';
      case 'it':
        return 'it';
      default:
        break;
    }
  }

  return 'en';
}

function isLanguage(value: unknown): value is Language {
  return (
    typeof value === 'string' &&
    SUPPORTED_LANGUAGES.includes(value as Language)
  );
}

function readLocalStorageValue(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readLegacyMultipleNumbersEnabled(): boolean | undefined {
  const serializedPreferences = readLocalStorageValue(PREFERENCES_STORAGE_KEY);

  if (serializedPreferences === null) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(serializedPreferences);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'multipleNumbersEnabled' in parsed &&
      typeof parsed.multipleNumbersEnabled === 'boolean'
    ) {
      return parsed.multipleNumbersEnabled;
    }
  } catch {
    // Ignore invalid legacy settings and use the default value.
  }

  return undefined;
}

/**
 * Returns a synchronous bootstrap snapshot from the legacy localStorage keys.
 * Browser Storage remains the source of truth. Only explicit language choices
 * are mirrored locally; browser-detected defaults are never persisted.
 */
export function getInitialUserSettings(): UserSettings {
  const storedTheme = readLocalStorageValue(THEME_STORAGE_KEY);
  const storedLanguage = readLocalStorageValue(LANGUAGE_STORAGE_KEY);
  const hasManualLanguage =
    readLocalStorageValue(LANGUAGE_MANUAL_STORAGE_KEY) === 'true';

  return {
    theme: isTheme(storedTheme) ? storedTheme : getSystemTheme(),
    language:
      hasManualLanguage && isLanguage(storedLanguage)
        ? storedLanguage
        : getBrowserLanguage(),
    multipleNumbersEnabled: readLegacyMultipleNumbersEnabled() ?? false,
    rangeMin: readLocalStorageValue(RANGE_MIN_STORAGE_KEY) ?? '1',
    rangeMax: readLocalStorageValue(RANGE_MAX_STORAGE_KEY) ?? '100',
    numberCount: readLocalStorageValue(NUMBER_COUNT_STORAGE_KEY) ?? '5',
  };
}

function normalizeStoredSettings(record: StorageRecord): UserSettings {
  const initialSettings = getInitialUserSettings();
  const storedTheme = record[USER_SETTINGS_STORAGE_KEYS.theme];
  const storedLanguage = record[USER_SETTINGS_STORAGE_KEYS.language];
  const storedMultipleNumbersEnabled =
    record[USER_SETTINGS_STORAGE_KEYS.multipleNumbersEnabled];

  return {
    theme: isTheme(storedTheme) ? storedTheme : initialSettings.theme,
    language: isLanguage(storedLanguage)
      ? storedLanguage
      : initialSettings.language,
    multipleNumbersEnabled:
      typeof storedMultipleNumbersEnabled === 'boolean'
        ? storedMultipleNumbersEnabled
        : initialSettings.multipleNumbersEnabled,
    rangeMin: typeof record[USER_SETTINGS_STORAGE_KEYS.rangeMin] === 'string'
      ? record[USER_SETTINGS_STORAGE_KEYS.rangeMin] as string
      : initialSettings.rangeMin,
    rangeMax: typeof record[USER_SETTINGS_STORAGE_KEYS.rangeMax] === 'string'
      ? record[USER_SETTINGS_STORAGE_KEYS.rangeMax] as string
      : initialSettings.rangeMax,
    numberCount: typeof record[USER_SETTINGS_STORAGE_KEYS.numberCount] === 'string'
      ? record[USER_SETTINGS_STORAGE_KEYS.numberCount] as string
      : initialSettings.numberCount,
  };
}

function writeLocalStorageSnapshot(settings: UserSettings): void {
  try {
    localStorage.setItem(RANGE_MIN_STORAGE_KEY, settings.rangeMin);
    localStorage.setItem(RANGE_MAX_STORAGE_KEY, settings.rangeMax);
    localStorage.setItem(NUMBER_COUNT_STORAGE_KEY, settings.numberCount);
    localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({ multipleNumbersEnabled: settings.multipleNumbersEnabled }),
    );
  } catch {
    // Browser Storage is the persistent source; the localStorage mirror is only a bootstrap cache.
  }
}

function notifyListeners(patch: UserSettingsPatch): void {
  for (const listener of changeListeners) {
    listener(patch);
  }
}

function handleStorageChanges(
  changes: Record<string, { newValue?: unknown }>,
  areaName: string,
): void {
  if (areaName !== 'local') {
    return;
  }

  const patch: UserSettingsPatch = {};

  if (USER_SETTINGS_STORAGE_KEYS.theme in changes) {
    const value = changes[USER_SETTINGS_STORAGE_KEYS.theme]?.newValue;
    patch.theme = isTheme(value) ? value : getSystemTheme();
  }

  if (USER_SETTINGS_STORAGE_KEYS.language in changes) {
    const value = changes[USER_SETTINGS_STORAGE_KEYS.language]?.newValue;
    const manualFlagChanged = LANGUAGE_MANUAL_STORAGE_KEY in changes;
    const isManualLanguage = manualFlagChanged
      ? changes[LANGUAGE_MANUAL_STORAGE_KEY]?.newValue === true
      : readLocalStorageValue(LANGUAGE_MANUAL_STORAGE_KEY) === 'true';

    patch.language =
      isManualLanguage && isLanguage(value) ? value : getBrowserLanguage();

    try {
      if (isManualLanguage && isLanguage(value)) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
        localStorage.setItem(LANGUAGE_MANUAL_STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        localStorage.removeItem(LANGUAGE_MANUAL_STORAGE_KEY);
      }
    } catch {
      // Browser Storage remains the source of truth.
    }
  }

  if (USER_SETTINGS_STORAGE_KEYS.rangeMin in changes) {
    const value = changes[USER_SETTINGS_STORAGE_KEYS.rangeMin]?.newValue;
    patch.rangeMin = typeof value === 'string' ? value : '1';
  }

  if (USER_SETTINGS_STORAGE_KEYS.rangeMax in changes) {
    const value = changes[USER_SETTINGS_STORAGE_KEYS.rangeMax]?.newValue;
    patch.rangeMax = typeof value === 'string' ? value : '100';
  }

  if (USER_SETTINGS_STORAGE_KEYS.numberCount in changes) {
    const value = changes[USER_SETTINGS_STORAGE_KEYS.numberCount]?.newValue;
    patch.numberCount = typeof value === 'string' ? value : '5';
  }

  if (USER_SETTINGS_STORAGE_KEYS.theme in changes) {
    const value = changes[USER_SETTINGS_STORAGE_KEYS.theme]?.newValue;
    try {
      if (isTheme(value)) localStorage.setItem(THEME_STORAGE_KEY, value);
      else localStorage.removeItem(THEME_STORAGE_KEY);
    } catch { /* Browser Storage remains the source of truth. */ }
  }

  if (USER_SETTINGS_STORAGE_KEYS.multipleNumbersEnabled in changes) {
    const value =
      changes[USER_SETTINGS_STORAGE_KEYS.multipleNumbersEnabled]?.newValue;
    patch.multipleNumbersEnabled =
      typeof value === 'boolean' ? value : false;
  }

  if (Object.keys(patch).length === 0) {
    return;
  }

  writeLocalStorageSnapshot({ ...getInitialUserSettings(), ...patch });
  notifyListeners(patch);
}

function ensureStorageChangeListener(): void {
  if (storageListenerRegistered) {
    return;
  }

  browser.storage.onChanged.addListener(handleStorageChanges);
  storageListenerRegistered = true;
}

async function initializeBrowserStorage(): Promise<void> {
  ensureStorageChangeListener();

  const stored = (await browser.storage.local.get(STORAGE_KEY_LIST)) as StorageRecord;
  const legacySettings = getInitialUserSettings();
  const migration: StorageRecord = {};

  if (!isTheme(stored[USER_SETTINGS_STORAGE_KEYS.theme])) {
    const legacyTheme = readLocalStorageValue(THEME_STORAGE_KEY);
    if (isTheme(legacyTheme)) {
      migration[USER_SETTINGS_STORAGE_KEYS.theme] = legacyTheme;
    }
  }

  const storedLanguage = stored[USER_SETTINGS_STORAGE_KEYS.language];
  const hasManualLanguage = stored[LANGUAGE_MANUAL_STORAGE_KEY] === true;

  if (isLanguage(storedLanguage) && !hasManualLanguage) {
    // Older versions also persisted the detected browser language. Treat a
    // value that differs from the current browser preference as a legacy
    // manual choice; a matching value is just the old automatic default.
    if (storedLanguage !== getBrowserLanguage()) {
      migration[LANGUAGE_MANUAL_STORAGE_KEY] = true;
    } else {
      await browser.storage.local.remove(LANGUAGE_STORAGE_KEY);
      try {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        localStorage.removeItem(LANGUAGE_MANUAL_STORAGE_KEY);
      } catch {
        // Browser Storage remains the source of truth.
      }
    }
  } else if (!isLanguage(storedLanguage)) {
    const legacyLanguage = readLocalStorageValue(LANGUAGE_STORAGE_KEY);
    if (isLanguage(legacyLanguage)) {
      if (legacyLanguage !== getBrowserLanguage()) {
        migration[USER_SETTINGS_STORAGE_KEYS.language] = legacyLanguage;
        migration[LANGUAGE_MANUAL_STORAGE_KEY] = true;
      } else {
        try {
          localStorage.removeItem(LANGUAGE_STORAGE_KEY);
          localStorage.removeItem(LANGUAGE_MANUAL_STORAGE_KEY);
        } catch {
          // Browser Storage remains the source of truth.
        }
      }
    }
  }

  if (typeof stored[USER_SETTINGS_STORAGE_KEYS.rangeMin] !== 'string') {
    migration[USER_SETTINGS_STORAGE_KEYS.rangeMin] = legacySettings.rangeMin;
  }

  if (typeof stored[USER_SETTINGS_STORAGE_KEYS.rangeMax] !== 'string') {
    migration[USER_SETTINGS_STORAGE_KEYS.rangeMax] = legacySettings.rangeMax;
  }

  if (typeof stored[USER_SETTINGS_STORAGE_KEYS.numberCount] !== 'string') {
    migration[USER_SETTINGS_STORAGE_KEYS.numberCount] = legacySettings.numberCount;
  }

  if (
    typeof stored[USER_SETTINGS_STORAGE_KEYS.multipleNumbersEnabled] !== 'boolean'
  ) {
    migration[USER_SETTINGS_STORAGE_KEYS.multipleNumbersEnabled] =
      legacySettings.multipleNumbersEnabled;
  }

  if (Object.keys(migration).length > 0) {
    await browser.storage.local.set(migration);
  }

  writeLocalStorageSnapshot(
    normalizeStoredSettings({ ...stored, ...migration }),
  );
}

function ensureBrowserStorageInitialized(): Promise<void> {
  if (initializationPromise === null) {
    initializationPromise = initializeBrowserStorage().catch(() => {
      // Settings still fall back to defaults/legacy values if the API is unavailable.
    });
  }

  return initializationPromise;
}

/** Loads and validates all user settings through Browser Storage API. */
export async function getUserSettings(): Promise<UserSettings> {
  await ensureBrowserStorageInitialized();

  try {
    const stored = (await browser.storage.local.get(STORAGE_KEY_LIST)) as StorageRecord;
    const settings = normalizeStoredSettings(stored);
    writeLocalStorageSnapshot(settings);
    try {
      if (
        stored[LANGUAGE_MANUAL_STORAGE_KEY] === true &&
        isLanguage(stored[LANGUAGE_STORAGE_KEY])
      ) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, stored[LANGUAGE_STORAGE_KEY] as Language);
        localStorage.setItem(LANGUAGE_MANUAL_STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        localStorage.removeItem(LANGUAGE_MANUAL_STORAGE_KEY);
      }
    } catch {
      // Browser Storage remains the source of truth.
    }
    try {
      if (isTheme(stored[THEME_STORAGE_KEY])) {
        localStorage.setItem(THEME_STORAGE_KEY, stored[THEME_STORAGE_KEY] as Theme);
      } else {
        localStorage.removeItem(THEME_STORAGE_KEY);
      }
    } catch {
      // Browser Storage remains the source of truth.
    }
    return settings;
  } catch {
    return getInitialUserSettings();
  }
}

function createStoragePatch(patch: UserSettingsPatch): StorageRecord {
  const storagePatch: StorageRecord = {};

  if (patch.theme !== undefined) {
    if (!isTheme(patch.theme)) {
      throw new TypeError('Invalid theme value.');
    }
    storagePatch[USER_SETTINGS_STORAGE_KEYS.theme] = patch.theme;
  }

  if (patch.language !== undefined) {
    if (!isLanguage(patch.language)) {
      throw new TypeError('Invalid language value.');
    }
    storagePatch[USER_SETTINGS_STORAGE_KEYS.language] = patch.language;
    storagePatch[LANGUAGE_MANUAL_STORAGE_KEY] = true;
  }

  if (patch.rangeMin !== undefined) {
    if (typeof patch.rangeMin !== 'string') throw new TypeError('Invalid rangeMin value.');
    storagePatch[USER_SETTINGS_STORAGE_KEYS.rangeMin] = patch.rangeMin;
  }

  if (patch.rangeMax !== undefined) {
    if (typeof patch.rangeMax !== 'string') throw new TypeError('Invalid rangeMax value.');
    storagePatch[USER_SETTINGS_STORAGE_KEYS.rangeMax] = patch.rangeMax;
  }

  if (patch.numberCount !== undefined) {
    if (typeof patch.numberCount !== 'string') {
      throw new TypeError('Invalid numberCount value.');
    }
    storagePatch[USER_SETTINGS_STORAGE_KEYS.numberCount] = patch.numberCount;
  }

  if (patch.multipleNumbersEnabled !== undefined) {
    if (typeof patch.multipleNumbersEnabled !== 'boolean') {
      throw new TypeError('Invalid multipleNumbersEnabled value.');
    }
    storagePatch[USER_SETTINGS_STORAGE_KEYS.multipleNumbersEnabled] =
      patch.multipleNumbersEnabled;
  }

  return storagePatch;
}

/** Updates only the supplied settings and keeps unrelated values untouched. */
export function updateUserSettings(
  patch: UserSettingsPatch,
): Promise<void> {
  const operation = writeQueue.then(async () => {
    await ensureBrowserStorageInitialized();

    const storagePatch = createStoragePatch(patch);
    if (Object.keys(storagePatch).length === 0) {
      return;
    }

    await browser.storage.local.set(storagePatch);

    const nextLocalSnapshot = {
      ...getInitialUserSettings(),
      ...patch,
    };
    writeLocalStorageSnapshot(nextLocalSnapshot);
    if (patch.language !== undefined) {
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, patch.language);
        localStorage.setItem(LANGUAGE_MANUAL_STORAGE_KEY, 'true');
      } catch {
        // Browser Storage remains the source of truth.
      }
    }
    if (patch.theme !== undefined) {
      try { localStorage.setItem(THEME_STORAGE_KEY, patch.theme); } catch { /* Ignore cache failures. */ }
    }
    notifyListeners(patch);
  });

  writeQueue = operation.catch(() => {
    // Keep subsequent writes available even if a previous storage write fails.
  });

  return operation;
}

/** Subscribes to changes made in this extension context or another page. */
export function subscribeToUserSettings(
  listener: UserSettingsChangeListener,
): () => void {
  ensureStorageChangeListener();
  changeListeners.add(listener);

  return () => {
    changeListeners.delete(listener);
  };
}

/** Returns the explicitly selected theme, or null when the OS theme should be used. */
export async function getStoredTheme(): Promise<Theme | null> {
  await ensureStorageChangeListener();
  try {
    const stored = (await browser.storage.local.get(THEME_STORAGE_KEY)) as StorageRecord;
    return isTheme(stored[THEME_STORAGE_KEY]) ? stored[THEME_STORAGE_KEY] : null;
  } catch {
    const legacyTheme = readLocalStorageValue(THEME_STORAGE_KEY);
    return isTheme(legacyTheme) ? legacyTheme : null;
  }
}
