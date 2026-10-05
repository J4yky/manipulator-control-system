import { useLanguage } from "../../i18n/LanguageContext";

export function SystemStatusPanel() {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">
                {t("systemStatus")}
            </h2>
            <div className="flex flex-col divide-y divide-slate-700/60">
                <div className="flex items-center justify-between pb-4">
                    <span className="text-sm text-slate-400">{t("state")}</span>
                    <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-slate-100">[ {t("IDLE")} ]</span>
                </div>
                <div className="flex flex-col gap-2 py-4">
                    <h3 className="text-lg font-semibold">
                        {t("position")}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span>X</span>
                        <span>0.000 mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Y</span>
                        <span>0.000 mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Z</span>
                        <span>0.000 mm</span>
                    </div>
                </div>
                <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-slate-400">{t("homing")}</span>
                    <span className="text-sm font-medium text-slate-100">{t("notHomed")}</span>
                </div>
                <div className="flex items-center justify-between py-4">
                    <span className="text-sm text-slate-400">{t("controlMode")}</span>
                    <span className="text-sm font-medium text-slate-100">{t("remote")}</span>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
                    <h3 className="text-lg font-semibold">
                        {t("limitSwitches")}
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-2">
                        <div className="flex items-center gap-2">
                            <span>X-</span>
                            <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 bg-slate-500 ring-slate-500/20" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span>X+</span>
                            <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 bg-slate-500 ring-slate-500/20" />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span>Y-</span>
                            <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 bg-slate-500 ring-slate-500/20" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Y+</span>
                            <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 bg-slate-500 ring-slate-500/20" />
                        </div>
                        
                        
                        <div className="flex items-center gap-2">
                            <span>Z-</span>
                            <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 bg-slate-500 ring-slate-500/20" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Z+</span>
                            <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 bg-slate-500 ring-slate-500/20" />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}