export {
  getInitialUserSettings,
  getUserSettings,
  LANGUAGE_STORAGE_KEY,
  MULTIPLE_NUMBERS_ENABLED_STORAGE_KEY,
  PREFERENCES_STORAGE_KEY,
  subscribeToUserSettings,
  updateUserSettings,
  USER_SETTINGS_STORAGE_KEYS,
} from './settingsStorage';

export type {
  UserSettings,
  UserSettingsChangeListener,
  UserSettingsPatch,
} from './settingsStorage';
