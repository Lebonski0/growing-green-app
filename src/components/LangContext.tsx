'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from '@/lib/translations';

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('gg_lang') as Lang | null;
    if (stored && ['en', 'fr', 'es', 'zh', 'hi', 'ar'].includes(stored)) {
      setLangState(stored);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('gg_lang', newLang);
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
