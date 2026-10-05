export type MachineState =
  | "idle"
  | "moving"
  | "homing"
  | "alarm"
  | "stopped";

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected";

export type LogLevel =
  | "info"
  | "warning"
  | "error";

export type MachineStateEvent = {
  type: "machineState";
  state: MachineState;
  position: {
    x: number;
    y: number;
    z: number;
  };
  homed: boolean;
};

export type ControllerStateEvent = {
  type: "controllerState";
  state: ConnectionState;
};

export type CameraStateEvent = {
  type: "cameraState";
  state: ConnectionState;
};

export type LogEvent = {
  type: "log";
  level: LogLevel;
  message: string;
  timestamp: string;
};

export type ErrorEvent = {
  type: "error";
  requestId?: string;
  message: string;
  timestamp: string;
};

export type AckEvent = {
  type: "ack";
  requestId: string;
};

export type ServerEvent =
  | MachineStateEvent
  | ControllerStateEvent
  | CameraStateEvent
  | LogEvent
  | ErrorEvent
  | AckEvent;