import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../locales/en.json';
import lv from '../locales/lv.json';

export type Language = 'en' | 'lv';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalized: (data: Record<string, any>, field: string) => string | any[];
}

const dictionaries: Record<Language, Record<string, string>> = {
  en,
  lv,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('app_language') as Language;
      if (savedLang === 'en' || savedLang === 'lv') {
        setLanguageState(savedLang);
      } else {
        const browserLang = navigator.language.slice(0, 2);
        if (browserLang === 'lv') {
          setLanguageState('lv');
        }
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for language persistence');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_language', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn('Failed to save language in localStorage');
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = dictionaries[language]?.[key] || dictionaries.en?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }
    return text;
  };

  const getLocalized = (data: Record<string, any>, field: string): any => {
    if (!data) return '';
    if (language === 'lv') {
      const lvVal = data[`${field}_lv`] ?? data[`${field}Lv`];
      if (Array.isArray(lvVal) && lvVal.length > 0) return lvVal;
      if (typeof lvVal === 'string' && lvVal.trim()) return lvVal;
    }
    return data[field] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
