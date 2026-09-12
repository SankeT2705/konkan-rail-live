import { createContext, useContext, type ReactNode } from 'react';
import { en } from './en';
import { hi } from './hi';
import { useTrainStore } from '../store/useTrainStore';

const translations = { en, hi };

const I18nContext = createContext(en);

export function I18nProvider({ children }: { children: ReactNode }) {
  const language = useTrainStore(s => s.language);
  return (
    <I18nContext.Provider value={translations[language]}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
