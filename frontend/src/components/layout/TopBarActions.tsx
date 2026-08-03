import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";

export function TopBarActions() {
    return (
        <div className="flex items-center gap-3">
            <Button
                size="icon"
                className="group"
                aria-label="Settings"
                title="Settings"
            >
                <Cog6ToothIcon 
                    aria-hidden="true"
                    className="size-5 transition duration-200 ease-out group-hover:rotate-90 group-hover:scale-110" 
                />
            </Button>
            <Button>Logs</Button>
            <Button variant="primary">Connect</Button>
        </div>
    );
}