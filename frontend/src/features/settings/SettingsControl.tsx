import { useState } from "react";
import { SettingsDialog } from "./SettingsDialog";
import { Button } from "../../components/ui/Button";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export function SettingsControl() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    function openSettings() {
        setIsSettingsOpen(true);
    }

    function closeSettings() {
        setIsSettingsOpen(false);
    }

    return (
        <>
            <Button
                size="icon"
                className="group"
                aria-label="Open Settings"
                title="Settings"
                onClick={openSettings}
            >
                <Cog6ToothIcon 
                    aria-hidden="true"
                    className="size-5 transition-transform duration-200 ease-out group-hover:rotate-90 group-hover:scale-110" 
                />
            </Button>

            {isSettingsOpen && (
                <SettingsDialog onClose={closeSettings} />
            )}
        </>
    );
}