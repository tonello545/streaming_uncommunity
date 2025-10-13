import React, { createContext, useState, useContext } from 'react';
import { translations, defaultLanguage } from '../locales';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Recupera la lingua dal localStorage o usa quella di default
    return localStorage.getItem('language') || defaultLanguage;
  });

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback alla lingua di default se la chiave non esiste
        value = translations[defaultLanguage];
        for (const fallbackKey of keys) {
          if (value && value[fallbackKey]) {
            value = value[fallbackKey];
          } else {
            return key; // Ritorna la chiave se non trova la traduzione
          }
        }
        break;
      }
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation deve essere usato all\'interno di LanguageProvider');
  }
  return context;
};
