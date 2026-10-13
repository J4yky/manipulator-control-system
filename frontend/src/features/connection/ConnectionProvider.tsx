import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { ConnectionState } from "../../types/events";
import { setConnectionStateListener, setControllerStateListener } from "../../services/websocket";
import { ConnectionContext } from "./ConnectionContext";

type ConnectionProviderProps = {
    children: ReactNode;
};

export function ConnectionProvider({
    children,
}: ConnectionProviderProps) {
    const [connectionState, setConnectionState] =
        useState<ConnectionState>("disconnected");

    const [controllerState, setControllerState] =
        useState<ConnectionState>("disconnected");

    useEffect(() => {
        setConnectionStateListener(setConnectionState);
        setControllerStateListener(setControllerState);

        return () => {
            setConnectionStateListener(null);
            setControllerStateListener(null);
        };
    }, []);

    return (
        <ConnectionContext.Provider
            value={{
                connectionState,
                controllerState,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
}