
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Locale } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // 1. Check LocalStorage
    const saved = localStorage.getItem('voice_orchestrator_locale') as Locale;
    if (saved && translations[saved]) {
      setLocaleState(saved);
      return;
    }

    // 2. Check Navigator
    const browserLang = navigator.language.split('-')[0] as Locale;
    if (translations[browserLang]) {
      setLocaleState(browserLang);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('voice_orchestrator_locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[locale];
    let fallback: any = translations['en'];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        current = undefined;
      }
      
      if (fallback && fallback[key] !== undefined) {
        fallback = fallback[key];
      }
    }

    return current || fallback || path;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
