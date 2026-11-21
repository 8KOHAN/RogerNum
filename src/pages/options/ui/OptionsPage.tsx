import { ThemeSettings } from '../../../features/theme';

import './OptionsPage.css';

export function OptionsPage() {
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
          <p className="options-brand-subtitle">RANDOM NUMBER GENERATOR</p>
        </div>

        <span className="options-brand-label">SETTINGS</span>
      </header>

      <main className="options-main">
        <div className="options-page-heading">
          <p className="options-page-eyebrow">EXTENSION PREFERENCES</p>
          <h1>Settings</h1>
          <p>Personalize your RogerNum experience.</p>
        </div>

        <ThemeSettings />
      </main>

      <footer className="options-footer">
        <span>RogerNum</span>
        <span>Changes are saved automatically</span>
      </footer>
    </div>
  );
}
