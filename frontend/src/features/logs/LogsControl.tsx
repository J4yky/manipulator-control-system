import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { LogsWindow } from "./LogsWindow";
import { useLanguage } from "../../i18n/LanguageContext";

export function LogsControl() {
    const { t } = useLanguage();
    const [isLogsOpen, setIsLogsOpen] = useState(false);

    function openLogs() {
        setIsLogsOpen(true);
    }

    function closeLogs() {
        setIsLogsOpen(false);
    }

    return (
        <>
            <Button onClick={openLogs}>
                {t("logs")}
            </Button>

            <LogsWindow
                isOpen={isLogsOpen}
                onClose={closeLogs}
            />
        </>
    )
}