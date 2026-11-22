import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, useI18n } from '../../../app/providers/i18n';

import './LanguageSelector.css';

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();

  return (
    <select
      id="roger-num-language"
      className="language-selector-select"
      aria-label={t('language.selectLabel')}
      value={language}
      onChange={(event) => setLanguage(event.target.value as typeof language)}
    >
      {SUPPORTED_LANGUAGES.map((languageOption) => (
        <option key={languageOption} value={languageOption}>
          {LANGUAGE_LABELS[languageOption]}
        </option>
      ))}
    </select>
  );
}
