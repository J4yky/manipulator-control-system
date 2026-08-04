import { Button } from "../../components/ui/Button";
import { CircleFlag } from "react-circle-flags";
import { useLanguage } from "../../i18n/LanguageContext";

export function LanguageSwitcher() {
    const { language, changeLanguage } = useLanguage();

    function toggleLanguage() {
        changeLanguage(language === "en" ? "pl" : "en");
    }

    return (
        <Button
            size="icon"
            variant="ghost"
            className="rounded-full!"
            onClick={toggleLanguage}
            aria-label={
                language === "en"
                ? "Switch language to Polish"
                : "Zmień język na angielski"
            }
            title={
                language === "en"
                ? "Switch language to Polish"
                : "Zmień język na angielski"
            }
        >
            <CircleFlag
                countryCode={language === "en" ? "gb" : "pl"}
                height="24"
                alt=""
                aria-hidden="true"
                className="h-6 w-6 shadow-sm"
            />
        </Button>
    );
}

