import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { ConnectionState } from "../../types/events";
import { setConnectionStateListener } from "../../services/websocket";
import { ConnectionContext } from "./ConnectionContext";

type ConnectionProviderProps = {
    children: ReactNode;
};

export function ConnectionProvider({
    children,
}: ConnectionProviderProps) {
    const [connectionState, setConnectionState] =
        useState<ConnectionState>("disconnected");

    useEffect(() => {
        setConnectionStateListener(setConnectionState);

        return () => {
            setConnectionStateListener(null);
        };
    }, []);

    return (
        <ConnectionContext.Provider
            value={{connectionState}}
        >
            {children}
        </ConnectionContext.Provider>
    );
}