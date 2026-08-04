import {translations, type Language, type TranslationKey} from "./translations";
import { LanguageContext } from "./LanguageContext";
import { useState, type ReactNode } from "react";

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({
    children, 
}: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>("en");

    function changeLanguage(newLanguage: Language) {
        setLanguage(newLanguage);
    }

    function t(key: TranslationKey) {
        return translations[language][key];
    }

    return (
        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

