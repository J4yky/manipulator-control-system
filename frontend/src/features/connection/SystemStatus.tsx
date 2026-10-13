import { useLanguage } from "../../i18n/LanguageContext";
import { useConnection } from "../../features/connection/ConnectionContext";

export function SystemStatus() {
    const { t } = useLanguage();
    const { connectionState, controllerState } = useConnection();
    const serverStatusText = 
        connectionState === "connected"
            ? t("connected")
            : connectionState === "connecting"
                ? t("connecting")
                : t("disconnected");

    const serverStatusColor = 
        connectionState === "connected"
            ? "bg-green-500 ring-green-500/20"
            : connectionState === "connecting"
                ? "bg-amber-50 ring-amber-500/20"
                : "bg-red-500 ring-red-500/20";

    const controllerStateText = 
        controllerState === "connected"
            ? t("connected")
            : controllerState === "connecting"
                ? t("connecting")
                : t("disconnected");

    const controllerStateColor = 
        controllerState === "connected"
            ? "bg-green-500 ring-green-500/20"
            : controllerState === "connecting"
                ? "bg-amber-50 ring-amber-500/20"
                : "bg-red-500 ring-red-500/20";

    return (
        <div className="flex flex-col items-end gap-y-2">
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300 whitespace-nowrap">Server: {serverStatusText}</span>
                <span aria-hidden="true" className={`h-3 w-3 rounded-full ring-2 shrink-0 ${serverStatusColor}`} />
            </div>
            <div className="flex items-center gap-2">     
                <span className="text-sm text-slate-300 whitespace-nowrap">Controller: {controllerStateText}</span>
                <span aria-hidden="true" className={`h-3 w-3 rounded-full ring-2 shrink-0 ${controllerStateColor}`} />
            </div> 
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300 whitespace-nowrap">Camera: Disconnected</span>
                <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 ring-red-500/20 bg-red-500" />
            </div>
        </div>
    );
}