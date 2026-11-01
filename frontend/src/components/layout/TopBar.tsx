import { SystemStatus } from "../../features/connection/SystemStatus";
import { TopBarActions } from "./TopBarActions";
import { useLanguage } from "../../i18n/LanguageContext";

export function TopBar() {
  const { t } = useLanguage();

  return (
    <header className="flex flex-col items-start justify-between gap-4 sm:flex-row">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{t("appName")}</h1>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <SystemStatus />
        <TopBarActions />
      </div>
    </header>
  );
}
