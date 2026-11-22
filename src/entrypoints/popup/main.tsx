import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { LanguageProvider } from '../../app/providers/i18n';
import { ThemeProvider } from '../../app/providers/theme/ThemeProvider';
import { PreferencesProvider } from '../../app/providers/preferences';
import '../../app/styles/theme.css';
import '../../app/styles/global.css';
import { PopupPage } from '../../pages/popup';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Popup root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <PreferencesProvider>
          <PopupPage />
        </PreferencesProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
);
