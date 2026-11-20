import { GenerateNumberForm } from '../../../features/generate-number';

import './PopupPage.css';

export function PopupPage() {
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
            THE GOLDEN GENERATOR
          </p>
        </div>

        <div className="brand-crown" aria-hidden="true">
          ♛
        </div>
      </header>

      <GenerateNumberForm />

      <footer className="popup-footer">
        <span>RogerNum</span>
        <span>GOLDEN EDITION</span>
      </footer>
    </div>
  );
}