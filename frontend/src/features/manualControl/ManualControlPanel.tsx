import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import type { Axis, MoveCommand } from "../../types/commands";


type MoveDirection = -1 | 1;

export function ManualControlPanel() {
    const { t } = useLanguage();
    const [selectedAxis, setSelectedAxis] = useState<Axis>("X");
    const [distance, setDistance] = useState("10");
    const [speed, setSpeed] = useState("5");

    function handleMove(direction: MoveDirection) {
        const distanceValue = Number(distance);
        const speedValue = Number(speed);

        if (
            !Number.isFinite(distanceValue) ||
            !Number.isFinite(speedValue) ||
            distanceValue <= 0 ||
            speedValue <= 0
        ) {
            console.error("Invalid movement parameters:");
            return;
        }

        const command: MoveCommand = {
            type: "move",
            requestId: crypto.randomUUID(),
            axis: selectedAxis,
            distance: distanceValue * direction,
            speed: speedValue,
        };

        
        const jsonCommand = JSON.stringify(command);

        console.log(command);
        console.log(jsonCommand);
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">
                {t("manualControl")}
            </h2>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">
                    {t("axis")}
                </label>
                <div className="grid grid-cols-3 gap-2">
                    <Button
                    onClick={() => setSelectedAxis("X")}
                    variant={selectedAxis === "X" ? "primary" : "secondary"}
                    aria-pressed={selectedAxis === "X"}
                    >
                        X
                    </Button>
                    <Button
                        onClick={() => setSelectedAxis("Y")}
                        variant={selectedAxis === "Y" ? "primary" : "secondary"}
                        aria-pressed={selectedAxis === "Y"}
                    >
                        Y
                    </Button>
                    <Button
                        onClick={() => setSelectedAxis("Z")}
                        variant={selectedAxis === "Z" ? "primary" : "secondary"}
                        aria-pressed={selectedAxis === "Z"}
                    >
                        Z
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="distance" className="text-sm font-medium text-slate-300">
                    {t("distance")} [mm]
                </label>
                <input
                    id="distance" 
                    type="number"
                    min={0}
                    step={0.1}
                    value={distance}
                    onChange={(event) => setDistance(event.target.value)}
                    className="scheme-dark w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />

                <label htmlFor="speed" className="text-sm font-medium text-slate-300">
                    {t("speed")} [mm/s]
                </label>
                <input
                    id="speed" 
                    type="number"
                    min={0}
                    step={0.1}
                    value={speed}
                    onChange={(event) => setSpeed(event.target.value)}
                    className="scheme-dark w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => handleMove(-1)}>
                    {t("move")} -
                </Button>
                <Button onClick={() => handleMove(1)}>
                    {t("move")} +
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-400">
                    Selected axis: {selectedAxis}
                </p>
                <p className="text-sm text-slate-400">
                    Distance: {distance}
                </p>
                <p className="text-sm text-slate-400">
                    Speed: {speed}
                </p>
            </div>
            
        </div>
    );
}