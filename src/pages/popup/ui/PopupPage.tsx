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
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.09a2 2 0 0 1 1 1.72v.5a2 2 0 0 1-1 1.74l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.72l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <span>{t('menu.settings')}</span>
            </Button>

            <div className="popup-menu-divider" role="separator" />

            <a
              className="popup-menu-action popup-menu-link"
              href="https://github.com/8KOHAN/RogerNum"
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              onClick={() => setIsMenuOpen(false)}
            >
              <span
                className="popup-menu-item-icon popup-menu-item-icon--brand"
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" width="17" height="17">
                  <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-1.87c-3.1.67-3.75-1.32-3.75-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.6 1.2 3.23.92.1-.72.39-1.2.7-1.48-2.47-.28-5.07-1.24-5.07-5.52 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.1-1.42 3.04-1.15 3.04-1.15.6 1.53.22 2.67.11 2.95.72.78 1.15 1.78 1.15 3 0 4.3-2.61 5.23-5.1 5.51.4.35.75 1.02.75 2.06V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
                </svg>
              </span>
              <span>{t('menu.githubRepository')}</span>
              <span className="popup-menu-item-trailing-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path d="M14 3h7v7" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </span>
            </a>
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
