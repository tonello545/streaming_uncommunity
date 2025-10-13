import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';

ReactDOM.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Esporta per uso in altri moduli
export { VixSrcClient } from './VixSrcClient';
export * from './types/vixsrc';