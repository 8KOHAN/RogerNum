import { browser } from 'wxt/browser';

import {
  DEFAULT_THEME,
  isTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from '../theme/themes';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/locales';

export const LANGUAGE_STORAGE_KEY = 'roger-num:language';
export const PREFERENCES_STORAGE_KEY = 'roger-num:preferences';
export const MULTIPLE_NUMBERS_ENABLED_STORAGE_KEY =
  'roger-num:multiple-numbers-enabled';

export const USER_SETTINGS_STORAGE_KEYS = {
  theme: THEME_STORAGE_KEY,
  language: LANGUAGE_STORAGE_KEY,
  multipleNumbersEnabled: MULTIPLE_NUMBERS_ENABLED_STORAGE_KEY,
} as const;

const STORAGE_KEY_LIST = Object.values(USER_SETTINGS_STORAGE_KEYS);

type StorageRecord = Record<string, unknown>;

export interface UserSettings {
  theme: Theme;
  language: Language;
  multipleNumbersEnabled: boolean;
}

export type UserSettingsPatch = Partial<UserSettings>;
export type UserSettingsChangeListener = (patch: UserSettingsPatch) => void;

const changeListeners = new Set<UserSettingsChangeListener>();

let initializationPromise: Promise<void> | null = null;
let writeQueue: Promise<void> = Promise.resolve();
let storageListenerRegistered = false;

function getBrowserLanguage(): Language {
  const browserLanguage =
    typeof navigator === 'undefined' ? '' : navigator.language.toLowerCase();

  return browserLanguage.startsWith('uk') ? 'uk' : 'en';
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
 * Browser Storage remains the source of truth; the localStorage copy avoids a
 * visible default-theme/language flash before the asynchronous API responds.
 */
export function getInitialUserSettings(): UserSettings {
  const storedTheme = readLocalStorageValue(THEME_STORAGE_KEY);
  const storedLanguage = readLocalStorageValue(LANGUAGE_STORAGE_KEY);

  return {
    theme: isTheme(storedTheme) ? storedTheme : DEFAULT_THEME,
    language: isLanguage(storedLanguage) ? storedLanguage : getBrowserLanguage(),
    multipleNumbersEnabled: readLegacyMultipleNumbersEnabled() ?? false,
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
  };
}

function writeLocalStorageSnapshot(settings: UserSettings): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, settings.theme);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, settings.language);
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
    patch.theme = isTheme(value) ? value : DEFAULT_THEME;
  }

  if (USER_SETTINGS_STORAGE_KEYS.language in changes) {
    const value = changes[USER_SETTINGS_STORAGE_KEYS.language]?.newValue;
    patch.language = isLanguage(value) ? value : getBrowserLanguage();
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
    migration[USER_SETTINGS_STORAGE_KEYS.theme] = legacySettings.theme;
  }

  if (!isLanguage(stored[USER_SETTINGS_STORAGE_KEYS.language])) {
    migration[USER_SETTINGS_STORAGE_KEYS.language] = legacySettings.language;
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
