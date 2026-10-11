import type { ConnectionState } from "../types/events";
import type { 
    IncomingMessage,
    OutgoingMessage
} from "../types/messages";

let socket: WebSocket | null = null;
let connectionState: ConnectionState = "disconnected";
let onConnectionStateChange:
    ((state: ConnectionState) => void) | null = null;

function setConnectionState(state: ConnectionState) {
    connectionState = state;
    onConnectionStateChange?.(state);
}

export function setConnectionStateListener(
    listener: ((state: ConnectionState) => void) | null
) {
    onConnectionStateChange = listener;

    if (listener) {
        listener(connectionState);
    }
}

export function connectWebSocket() {
    if (
        socket?.readyState === WebSocket.CONNECTING ||
        socket?.readyState === WebSocket.OPEN
    ) {
        console.log("WebSocket is already connected");
        return;
    }

    setConnectionState("connecting");

    socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
        setConnectionState("connected");
        console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
        handleIncomingMessage(event.data)
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
        socket = null;
        setConnectionState("disconnected");
    };
}

export function disconnectWebSocket() {
    if (socket === null) {
        return;
    }

    if (
        socket.readyState === WebSocket.CLOSING ||
        socket.readyState === WebSocket.CLOSED
    ) {
        return;
    }

    socket.close(1000, "Client disconnected");
}

export function sendWebSocketMessage(message: OutgoingMessage) {
    if (socket?.readyState !== WebSocket.OPEN) {
        console.error("WebSocket is not connected");
        return;
    }

    socket.send(JSON.stringify(message));
}

function handleIncomingMessage(rawMessage: string) {
    try {
        const message =
            JSON.parse(rawMessage) as IncomingMessage;

            switch (message.type) {
                case "ack":
                    console.log(
                        "Command acknowledged:",
                        message.requestId
                    );
                    break;

                case "error":
                    console.error(
                        "Backend error:",
                        message.message
                    );
                    break;

                default:
                    console.log(
                        "Unhandled backend message:",
                        message
                    );
            }
            
    } catch (error) {
        console.error("Invalid message from backend:", error)
    }
}