import { SystemStatus } from "../../features/connection/SystemStatus";
import { TopBarActions } from "./TopBarActions";
import { useLanguage } from "../../i18n/LanguageContext";

export function TopBar() {
    const { t } = useLanguage();

    return (
        <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{t("appName")}</h1>
            </div>
            <div className="flex flex-wrap justify-end items-center gap-3">
                <SystemStatus />
                <TopBarActions />
            </div>
        </header>
    );
}

