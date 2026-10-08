import { FunnelIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "../../components/ui/Button";
import {
    LogsFilterWindow,
    type LogSourceFilter,
} from "./LogsFilterWindow";

type LogsFilterControlProps = {
    value: LogSourceFilter;
    onChange: (source: LogSourceFilter) => void;
};

export function LogsFilterControl({
    value, 
    onChange 
}: LogsFilterControlProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    function selectSource(source: LogSourceFilter) {
        onChange(source);
        setIsFilterOpen(false);
    }

    return (
        <div className="relative">
            <Button 
                size="icon" 
                variant={value === "all" ? "ghost" : "primary"}
                onClick={() => setIsFilterOpen((open) => !open)}
                aria-expanded={isFilterOpen}
                >
                <FunnelIcon
                aria-hidden="true"
                className="size-5" 
                />
            </Button>

            <LogsFilterWindow
                isOpen={isFilterOpen}
                selectedSource={value}
                onSelect={selectSource}
            />
        </div>
    )
}