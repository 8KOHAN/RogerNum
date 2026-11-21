import { GenerateNumberForm } from '../../../features/generate-number';
import { ThemeSelector } from '../../../features/theme';
import { THEMES } from '../../../app/providers/theme/themes';
import { useTheme } from '../../../app/providers/theme/ThemeProvider';

import './PopupPage.css';

export function PopupPage() {
  const { theme } = useTheme();
  const themeCopy = THEMES[theme];

  return (
    <div className="popup-shell">
      <header className="brand-header">
        <div className="brand-logo">
          <span>RN</span>
        </div>

        <div className="brand-info">
          <h1 className="brand-title">
            Roger<span>Num</span>
          </h1>

          <p className="brand-subtitle">
            {themeCopy.brandSubtitle}
          </p>
        </div>

        <div className="brand-crown" aria-hidden="true">
          ♛
        </div>

        <ThemeSelector />
      </header>

      <GenerateNumberForm />

      <footer className="popup-footer">
        <span>RogerNum</span>
        <span>{themeCopy.editionLabel}</span>
      </footer>
    </div>
  );
}
