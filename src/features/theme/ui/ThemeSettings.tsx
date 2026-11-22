import {
  THEME_IDS,
  THEMES,
  type Theme,
} from '../../../app/providers/theme/themes';
import { useTheme } from '../../../app/providers/theme/ThemeProvider';
import { useI18n } from '../../../app/providers/i18n';
import { Button, Card } from '../../../shared/ui';

import './ThemeSettings.css';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { t, themeText } = useI18n();
  const activeTheme = themeText[theme];

  function handleThemeSelect(nextTheme: Theme) {
    setTheme(nextTheme);
  }

  return (
    <Card className="theme-settings-card">
      <div className="theme-settings-header">
        <div className="theme-settings-heading">
          <p className="theme-settings-eyebrow">{t('settings.personalization')}</p>
          <h2 id="theme-settings-title">{t('theme.appearance')}</h2>
          <p className="theme-settings-description">{t('settings.themeDescription')}</p>
        </div>

        <span className="theme-settings-current">
          {t('settings.selectedTheme', { theme: activeTheme.label })}
        </span>
      </div>

      <div
        className="theme-settings-options"
        role="group"
        aria-labelledby="theme-settings-title"
      >
        {THEME_IDS.map((themeId) => {
          const option = themeText[themeId];
          const isSelected = themeId === theme;

          return (
            <Button
              key={themeId}
              className={`theme-settings-option${isSelected ? ' is-selected' : ''}`}
              variant="ghost"
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleThemeSelect(themeId)}
            >
              <span
                className="theme-settings-option-swatch"
                style={{ backgroundColor: THEMES[themeId].swatch }}
                aria-hidden="true"
              />

              <span className="theme-settings-option-copy">
                <span className="theme-settings-option-label">{option.label}</span>
                <span className="theme-settings-option-description">{option.description}</span>
              </span>

              <span className="theme-settings-option-check" aria-hidden="true">
                {isSelected ? '✓' : ''}
              </span>
            </Button>
          );
        })}
      </div>

      <p className="theme-settings-note" role="status" aria-live="polite">
        {t('settings.themeSavedAutomatically')}
      </p>
    </Card>
  );
}
