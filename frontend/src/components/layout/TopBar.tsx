import { SystemStatus } from "../../features/connection/SystemStatus";
import { TopBarActions } from "./TopBarActions";

export function TopBar() {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">Manipulator Control Center</h1>
            </div>
            <div className="flex flex-wrap justify-end items-center gap-3">
                <SystemStatus />
                <TopBarActions />
            </div>
        </header>
    );
}

