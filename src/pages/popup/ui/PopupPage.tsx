import { useEffect, useRef, useState } from 'react';
import { browser } from 'wxt/browser';

import { GenerateNumberForm } from '../../../features/generate-number';
import { ThemeSelector } from '../../../features/theme';
import { LanguageSelector } from '../../../features/language';
import { useTheme } from '../../../app/providers/theme/ThemeProvider';
import { useI18n } from '../../../app/providers/i18n';
import { Button } from '../../../shared/ui';

import './PopupPage.css';

export function PopupPage() {
  const { theme } = useTheme();
  const { t, themeText } = useI18n();
  const themeCopy = themeText[theme];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuTriggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  function handleOpenSettings() {
    setIsMenuOpen(false);
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

        <div className="popup-overflow-menu" ref={menuRef}>
          <Button
            ref={menuTriggerRef}
            className="popup-menu-trigger"
            variant="ghost"
            size="icon"
            title={t('menu.moreOptions')}
            aria-label={t('menu.open')}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-controls="popup-overflow-menu-content"
            onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
              focusable="false"
            >
              <circle cx="5" cy="12" r="1.6" />
              <circle cx="12" cy="12" r="1.6" />
              <circle cx="19" cy="12" r="1.6" />
            </svg>
          </Button>

          <div
            id="popup-overflow-menu-content"
            className="popup-overflow-menu-content"
            role="menu"
            aria-label={t('menu.ariaLabel')}
            hidden={!isMenuOpen}
          >
            <div className="popup-menu-section">
              <span className="popup-menu-item-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="17" height="17">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                </svg>
              </span>
              <span className="popup-menu-item-label">{t('menu.appearance')}</span>
              <ThemeSelector />
            </div>

            <div className="popup-menu-section popup-language-section">
              <span className="popup-menu-item-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="17" height="17">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                </svg>
              </span>
              <span className="popup-menu-item-label">{t('language.label')}</span>
              <LanguageSelector />
            </div>

            <div className="popup-menu-divider" role="separator" />

            <Button
              className="popup-menu-action"
              variant="ghost"
              size="medium"
              role="menuitem"
              onClick={handleOpenSettings}
            >
              <span className="popup-menu-item-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="17" height="17">
                  <circle cx="12" cy="12" r="3" />
                  <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z" />
                </svg>
              </span>
              <span>{t('menu.settings')}</span>
            </Button>
          </div>
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
