import {
  THEME_IDS,
  THEMES,
  type Theme,
} from '../../../app/providers/theme/themes';
import { useTheme } from '../../../app/providers/theme/ThemeProvider';
import { Button, Card } from '../../../shared/ui';

import './ThemeSettings.css';

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const activeTheme = THEMES[theme];

  function handleThemeSelect(nextTheme: Theme) {
    setTheme(nextTheme);
  }

  return (
    <Card className="theme-settings-card">
      <div className="theme-settings-header">
        <div className="theme-settings-heading">
          <p className="theme-settings-eyebrow">PERSONALIZATION</p>
          <h2 id="theme-settings-title">Appearance</h2>
          <p className="theme-settings-description">
            Choose the color theme used across RogerNum.
          </p>
        </div>

        <span className="theme-settings-current">
          {activeTheme.label} selected
        </span>
      </div>

      <div
        className="theme-settings-options"
        role="group"
        aria-labelledby="theme-settings-title"
      >
        {THEME_IDS.map((themeId) => {
          const option = THEMES[themeId];
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
                style={{ backgroundColor: option.swatch }}
                aria-hidden="true"
              />

              <span className="theme-settings-option-copy">
                <span className="theme-settings-option-label">
                  {option.label}
                </span>
                <span className="theme-settings-option-description">
                  {option.description}
                </span>
              </span>

              <span
                className="theme-settings-option-check"
                aria-hidden="true"
              >
                {isSelected ? '✓' : ''}
              </span>
            </Button>
          );
        })}
      </div>

      <p className="theme-settings-note" role="status" aria-live="polite">
        Your appearance preference is saved automatically.
      </p>
    </Card>
  );
}
