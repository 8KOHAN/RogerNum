import { Card } from '../../../shared/ui';
import { useI18n } from '../../../app/providers/i18n';
import { LanguageSelector } from './LanguageSelector';

import './LanguageSettings.css';

export function LanguageSettings() {
  const { t } = useI18n();

  return (
    <Card className="language-settings-card">
      <div className="language-settings-copy">
        <p className="language-settings-eyebrow">{t('settings.personalization')}</p>
        <h2 id="language-settings-title">{t('language.label')}</h2>
        <p className="language-settings-description">{t('language.description')}</p>
      </div>

      <div className="language-settings-control">
        <label htmlFor="roger-num-language">{t('language.selectLabel')}</label>
        <LanguageSelector />
      </div>
    </Card>
  );
}
