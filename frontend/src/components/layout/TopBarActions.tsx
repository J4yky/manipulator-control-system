import { Button } from "../ui/Button";
import { SettingsControl } from "../../features/settings/SettingsControl";
import { useLanguage } from "../../i18n/LanguageContext";
import { LogsControl } from "../../features/logs/LogsControl";

export function TopBarActions() {
    const { t } = useLanguage();

    return (
        <div className="flex items-center gap-3">
            <SettingsControl />
            <LogsControl />
            <Button variant="primary">
                {t("connect")}
            </Button>
        </div>
    );
}