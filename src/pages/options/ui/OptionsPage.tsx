import { useEffect } from 'react';

import { useI18n } from '../../../app/providers/i18n';
import { LanguageSettings } from '../../../features/language';
import { ThemeSettings } from '../../../features/theme';

import './OptionsPage.css';

export function OptionsPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = t('settings.documentTitle');
  }, [t]);

  return (
    <div className="options-shell">
      <header className="options-brand-header">
        <div className="options-brand-logo" aria-hidden="true">
          <span>RN</span>
        </div>

        <div className="options-brand-info">
          <p className="options-brand-title">
            Roger<span>Num</span>
          </p>
          <p className="options-brand-subtitle">{t('app.subtitle')}</p>
        </div>

        <span className="options-brand-label">{t('settings.badge')}</span>
      </header>

      <main className="options-main">
        <div className="options-page-heading">
          <p className="options-page-eyebrow">{t('settings.eyebrow')}</p>
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.description')}</p>
        </div>

        <LanguageSettings />
        <ThemeSettings />
      </main>

      <footer className="options-footer">
        <span>RogerNum</span>
        <span>{t('settings.savedAutomatically')}</span>
      </footer>
    </div>
  );
}
