import { usePreferences } from '../../../app/providers/preferences';
import { useI18n } from '../../../app/providers/i18n';
import { Card } from '../../../shared/ui';

import './MultipleNumbersSettings.css';

export function MultipleNumbersSettings() {
  const { multipleNumbersEnabled, setMultipleNumbersEnabled } = usePreferences();
  const { t } = useI18n();

  return (
    <Card className="multiple-numbers-settings-card">
      <div className="multiple-numbers-settings-copy">
        <p className="multiple-numbers-settings-eyebrow">
          {t('settings.generatorFeatures')}
        </p>
        <h2 id="multiple-numbers-settings-title">
          {t('settings.multipleNumbersTitle')}
        </h2>
        <p
          id="multiple-numbers-settings-description"
          className="multiple-numbers-settings-description"
        >
          {t('settings.multipleNumbersDescription')}
        </p>
      </div>

      <label className="multiple-numbers-toggle">
        <span
          id="multiple-numbers-toggle-label"
          className="multiple-numbers-toggle-label"
        >
          {t('settings.multipleNumbersToggle')}
        </span>
        <input
          id="multiple-numbers-toggle"
          type="checkbox"
          role="switch"
          checked={multipleNumbersEnabled}
          aria-labelledby="multiple-numbers-toggle-label"
          aria-describedby="multiple-numbers-settings-description"
          onChange={(event) => setMultipleNumbersEnabled(event.target.checked)}
        />
        <span className="multiple-numbers-toggle-track" aria-hidden="true">
          <span className="multiple-numbers-toggle-thumb" />
        </span>
      </label>
    </Card>
  );
}
