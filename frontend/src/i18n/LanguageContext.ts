import { createContext, useContext } from "react";
import type { Language, TranslationKey } from "./translations";

export type LanguageContextValue = {
  language: Language;
  changeLanguage: (newLanguage: Language) => void;
  t: (key: TranslationKey) => string;
};

export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}