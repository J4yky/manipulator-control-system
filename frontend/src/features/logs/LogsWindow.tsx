import { Button } from "../../components/ui/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../../i18n/LanguageContext";
import { useState } from "react";

type LogsWindowProps = {
    isOpen: boolean;
    onClose: () => void;
};

type LogLevel = "info" | "warning" | "error";

type LogEntry = {
    id: number;
    timestamp: string;
    level: LogLevel;
    source: string;
    message: string;
};

type LogFilter = "all" | LogLevel;

//dummy logs for testing purposes
const mockLogs: LogEntry[] = [
    { 
        id: 1,
        timestamp: "12:00:00",
        level: "info",
        source: "SERVER",
        message: "Server started" ,
    },
    {
        id: 2,
        timestamp: "12:05:00",
        level: "info",
        source: "CONTROLLER",
        message: "Controller connected",
    },
    {
        id: 3,
        timestamp: "12:10:00",
        level: "warning",
        source: "CAMERA",
        message: "Camera unavailable",
    },
    {
        id: 4,
        timestamp: "12:15:00",
        level: "error",
        source: "CONTROLLER",
        message: "Connection lost",
    }
]

export function LogsWindow({ 
    isOpen, 
    onClose 
}: LogsWindowProps) {
    const { t } = useLanguage();
    const [filter, setFilter] = useState<LogFilter>("all");
    const filteredLogs = 
        filter === "all" 
        ? mockLogs 
        : mockLogs.filter((log) => log.level === filter);

    function getLogLevelColor(level: LogLevel) {
        if (level === "error") {
            return "text-red-400";
        }
        if (level === "warning") {
            return "text-amber-400";
        }
        return "text-blue-400";
    }

    return (
        <div className={`fixed right-0 top-0 h-screen flex-col w-96 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="flex flex-col items-center p-4 bg-slate-800 border-b border-slate-700">
                <div className="flex justify-between w-full">
                    <h2 className="text-lg font-semibold">{t("logs")}</h2>
                    <Button onClick={onClose} size="icon" variant="ghost">
                        <XMarkIcon
                        aria-hidden="true"
                        className="size-6"
                        />
                    </Button>
                </div>
                <div className="flex justify-between gap-2">
                    <Button
                        size="small"
                        variant={filter === "all" ? "primary" : "ghost"}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        size="small"
                        variant={filter === "info" ? "primary" : "ghost"}
                        onClick={() => setFilter("info")}
                    >
                        Info
                    </Button>
                    <Button
                        size="small"
                        variant={filter === "warning" ? "primary" : "ghost"}
                        onClick={() => setFilter("warning")}
                    >
                        Warnings
                    </Button>
                    <Button
                        size="small"
                        variant={filter === "error" ? "primary" : "ghost"}
                        onClick={() => setFilter("error")}
                    >
                        Errors
                    </Button>
                </div>
                
                <div className="flex flex-1 overflow-y-auto flex-col divide-y divide-slate-700/60">
                    {filteredLogs.map((log) => (
                        <div
                            key={log.id}
                            className="grid grid-cols-[auto_auto_auto_1fr] gap-3 py-3 text-sm"
                        >
                            <span className="text-slate-500">{log.timestamp}</span>

                            <span className={`font-semibold uppercase ${getLogLevelColor(log.level)}`}>{log.level}</span>

                            <span className="text-slate-400">{log.source}</span>

                            <span className="text-slate-200">{log.message}</span>
                        </div>
                        ))}
                </div>
            </div>
        </div>
    );
}