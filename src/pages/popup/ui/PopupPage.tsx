import { browser } from 'wxt/browser';

import { GenerateNumberForm } from '../../../features/generate-number';
import { ThemeSelector } from '../../../features/theme';
import { THEMES } from '../../../app/providers/theme/themes';
import { useTheme } from '../../../app/providers/theme/ThemeProvider';
import { Button } from '../../../shared/ui';

import './PopupPage.css';

export function PopupPage() {
  const { theme } = useTheme();
  const themeCopy = THEMES[theme];

  function handleOpenSettings() {
    void browser.runtime.openOptionsPage().catch((error: unknown) => {
      console.error('Failed to open RogerNum settings.', error);
    });
  }

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

        <div className="popup-header-actions">
          <ThemeSelector />

          <Button
            className="popup-settings-button"
            variant="ghost"
            size="icon"
            title="Settings"
            aria-label="Open RogerNum settings"
            onClick={handleOpenSettings}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z"
              />
            </svg>
          </Button>
        </div>
      </header>

      <GenerateNumberForm />

      <footer className="popup-footer">
        <span>RogerNum</span>
        <span>{themeCopy.editionLabel}</span>
      </footer>
    </div>
  );
}
