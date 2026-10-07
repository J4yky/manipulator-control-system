import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { ArrowPathIcon, VideoCameraSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/Button";

type CameraState = 
    | "disconnected" 
    | "connecting"
    | "streaming";

export function CameraPanel() {
    const { t } = useLanguage();
    const [cameraState, setCameraState] = useState<CameraState>("disconnected");

    function renderCameraContent() {
        if (cameraState === "streaming") {
            return (
                <div className="flex aspect-video rounded-md w-full items-center justify-center bg-black">
                    {t("cameraStreaming")}
                </div>
            );
        }

        if (cameraState === "connecting") {
            return (
                <div className="flex flex-col items-center justify-center min-h-32 gap-2">
                    <ArrowPathIcon aria-hidden="true" className="size-8 animate-spin text-blue-400"/>
                    <span className="text-sm font-semibold">{t("cameraConnecting")}</span>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-32 gap-2">
                <VideoCameraSlashIcon
                    aria-hidden="true"
                    className="size-8 text-slate-500"
                />
                <span className="text-sm font-semibold">{t("cameraDisconnected")}</span>
            </div>
        );
    }

    function cycleCameraState() {
        if (cameraState === "disconnected") {
            setCameraState("connecting");
            return;
        }

        if (cameraState === "connecting") {
            setCameraState("streaming");
            return;
        }

        setCameraState("disconnected");
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl  font-semibold">
                    {t("cameraPreview")}
                </h2>
                <Button onClick={cycleCameraState}>
                    Toggle camera
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
                <div className={`w-full rounded-xl border border-slate-700 bg-slate-900 p-4 overflow-hidden transition-[max-height] duration-300 ease-out
                    ${cameraState === "streaming"
                    ? "max-h-150"
                    : "max-h-40"}`
                }>
                    {renderCameraContent()}
                </div>
            </div>
        </div>
    );
}