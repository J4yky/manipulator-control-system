import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/Button";
import { LanguageSwitcher} from "../language/LanguageSwitcher";
import { useLanguage } from "../../i18n/LanguageContext";

type SettingsDialogProps = {
    onClose: () => void;
};

export function SettingsDialog({
    onClose,
}: SettingsDialogProps) {
    const { t } = useLanguage();
    return (
        <div
        className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        >
            <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                    <h2
                        id="settings-title"
                        className="text-lg font-semibold"
                    >
                        Settings
                    </h2>

                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close settings"
                        onClick={onClose}
                    >
                        <XMarkIcon
                        aria-hidden="true"
                        className="size-6"
                        />
                    </Button>
                </div>

                <div className="flex flex-col bg-slate-50/5 rounded-lg divide-y divide-slate-700/60 mt-6">
                    <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
                        <span className="text-sm text-slate-400">{t("language")}</span>
                        <LanguageSwitcher/>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
                        <span className="text-sm text-slate-400">{t("theme")}</span>
                        <span>Dark</span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-4">
                        <span className="text-sm text-slate-400">{t("cameraAutoplay")}</span>
                        <span>On</span>
                    </div>
                </div>
            </div>
        </div>
    );
}