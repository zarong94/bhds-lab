import { createContext, useContext, useEffect, useState } from 'react';
import en from '../i18n/en.json';
import ko from '../i18n/ko.json';

const translations = { en, ko };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('bhds-lang') || 'ko'; } catch { return 'ko'; } });

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[lang];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        // Fallback to Korean
        let fallback = translations['ko'];
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return result;
  };

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'ko' : 'en';
      try { localStorage.setItem('bhds-lang', next); } catch { /* ignore */ }
      return next;
    });
  };

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
