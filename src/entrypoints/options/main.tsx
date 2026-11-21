import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '../../app/providers/theme/ThemeProvider';
import '../../app/styles/theme.css';
import '../../app/styles/global.css';
import { OptionsPage } from '../../pages/options/ui/OptionsPage';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Options page root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <OptionsPage />
    </ThemeProvider>
  </StrictMode>,
);
