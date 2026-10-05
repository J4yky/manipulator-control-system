import type { ClientCommand } from "./commands";
import type { ServerEvent } from "./events";

export type OutgoingMessage = ClientCommand;
export type IncomingMessage = ServerEvent;

export type WebSocketMessage =
    | OutgoingMessage
    | IncomingMessage;