import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { LanguageProvider } from '../../app/providers/i18n';
import { ThemeProvider } from '../../app/providers/theme/ThemeProvider';
import { PreferencesProvider } from '../../app/providers/preferences';
import '../../app/styles/theme.css';
import '../../app/styles/global.css';
import { OptionsPage } from '../../pages/options';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Options page root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <PreferencesProvider>
          <OptionsPage />
        </PreferencesProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
);
