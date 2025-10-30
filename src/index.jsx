import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Esporta per uso in altri moduli
export { VixSrcClient } from './VixSrcClient';
export * from './types/vixsrc';