import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { PopupPage } from '../../pages/popup';
import '../../app/styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Popup root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <PopupPage />
  </StrictMode>,
);