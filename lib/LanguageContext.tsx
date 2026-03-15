"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Language, translations } from "@/lib/translations";

type TranslationsShape = typeof translations.en;

type LanguageContextType = {
  lang: Language;
  setLang: (l: Language) => void;
  t: TranslationsShape;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  // Cast to TranslationsShape to allow both dictionaries to satisfy the type
  const t = translations[lang] as TranslationsShape;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
