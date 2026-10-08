import { useLanguage } from "../../i18n/LanguageContext";
import { Button } from "../../components/ui/Button";

export type LogSource = "SERVER" | "CONTROLLER" | "CAMERA";
export type LogSourceFilter = "all" | LogSource;

type LogsFilterWindowProps = {
    isOpen: boolean;
    selectedSource: LogSourceFilter;
    onSelect: (source: LogSourceFilter) => void;
};

export function LogsFilterWindow({
    isOpen,
    selectedSource,
    onSelect,
}: LogsFilterWindowProps) {
    const { t } = useLanguage();
    const sources: LogSourceFilter[] = [
        "all",
        "SERVER",
        "CONTROLLER",
        "CAMERA",
    ]
    return (
        <div 
            className={`
                absolute left-0 top-full z-20 mt-2 w-48
                origin-top-left rounded-xl border border-slate-700
                bg-slate-900 p-3 shadow-xl
                transition duration-150
                ${
                    isOpen
                        ? "visible scale-100 opacity-100"
                        : "pointer-events-none invisible scale-95 opacity-0"
                }
            `}
            role="dialog"
            aria-label={t("filterSource")}
        >
            <p className="mb-2 text-sm font-semibold">
                {t("filterSource")}
            </p>

            <div className="flex flex-col gap-1">
                {sources.map((source) => (
                    <Button
                        key={source}
                        size="small"
                        className="w-full justify-start"
                        variant={
                            selectedSource === source
                                ? "primary"
                                : "ghost"
                        }
                        onClick={() => onSelect(source)}
                    >
                        {t(source)}
                    </Button>
                ))}
            </div>
        </div>
    );
}