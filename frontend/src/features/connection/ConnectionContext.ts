import { createContext, useContext } from "react";
import type { ConnectionState } from "../../types/events";

type ConnectionContextValue = {
    connectionState: ConnectionState;
    controllerState: ConnectionState;
};

export const ConnectionContext = 
    createContext<ConnectionContextValue | undefined>(undefined);

export function useConnection() {
    const context = useContext(ConnectionContext);

    if (context === undefined) {
        throw new Error(
            "useConnection must be used within ConnectionProvider"
        );
    }

    return context;
}