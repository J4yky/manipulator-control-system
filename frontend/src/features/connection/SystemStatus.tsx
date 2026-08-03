export function SystemStatus() {
    return (
        <div className="flex flex-col items-end gap-y-2">
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300 whitespace-nowrap">Server: Disconnected</span>
                <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 ring-red-500/20 bg-red-500" />
            </div>
            <div className="flex items-center gap-2">     
                <span className="text-sm text-slate-300 whitespace-nowrap">Controller: Disconnected</span>
                <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 ring-red-500/20 bg-red-500" />
            </div> 
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-300 whitespace-nowrap">Camera: Disconnected</span>
                <span aria-hidden="true" className="h-3 w-3 rounded-full ring-2 shrink-0 ring-red-500/20 bg-red-500" />
            </div>
        </div>
    );
}