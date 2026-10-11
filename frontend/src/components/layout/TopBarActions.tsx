import { Button } from "../ui/Button";
import { SettingsControl } from "../../features/settings/SettingsControl";
import { useLanguage } from "../../i18n/LanguageContext";
import { LogsControl } from "../../features/logs/LogsControl";
import { useConnection } from "../../features/connection/ConnectionContext";
import {
    connectWebSocket,
    disconnectWebSocket,
} from "../../services/websocket";

export function TopBarActions() {
    const { t } = useLanguage();
    const { connectionState } = useConnection();
    const isConnected = connectionState === "connected";
    const isConnecting = connectionState === "connecting";

    return (
        <div className="flex items-center gap-3">
            <SettingsControl />
            <LogsControl />
            <Button 
                variant={isConnected ? "secondary" : "primary"}
                onClick={
                    isConnected
                        ? disconnectWebSocket
                        : connectWebSocket
                }
                disabled={isConnecting}
            >
                {isConnecting
                    ? t("connecting")
                    : isConnected
                        ? t("disconnect")
                        : t("connect")}
            </Button>
        </div>
    );
}