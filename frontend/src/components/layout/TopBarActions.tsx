import { Button } from "../ui/Button";
import { SettingsControl } from "../../features/settings/SettingsControl";
import { useLanguage } from "../../i18n/LanguageContext";

export function TopBarActions() {
    const { t } = useLanguage();

    return (
        <div className="flex items-center gap-3">
            <SettingsControl />
            <Button>
                {t("logs")}
            </Button>
            <Button variant="primary">
                {t("connect")}
            </Button>
        </div>
    );
}