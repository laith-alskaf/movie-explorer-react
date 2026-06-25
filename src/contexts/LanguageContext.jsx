import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// 1. Create the Context
const LanguageContext = createContext();

// 2. Custom hook to use the LanguageContext
export const useLanguage = () => useContext(LanguageContext);

// 3. Provider Component
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  
  // State for the current language
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    // Whenever language changes, update html dir and lang attributes
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    // Save preference to localStorage
    localStorage.setItem('app_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang).then(() => {
      setLanguage(newLang);
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
