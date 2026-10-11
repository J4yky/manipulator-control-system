export type Axis = "X" | "Y" | "Z";

type CommandBase = {
    requestId: string;
};

export type MoveCommand = CommandBase & {
    type: "move";
    requestId:string
    axis: Axis;
    distanceMm: number;
    speedMmPerSecond: number;
};

export type HomeCommand = CommandBase & {
    type: "home";
};

export type StopCommand = CommandBase & {
    type: "stop";
};

export type ResetAlarmCommand = CommandBase & {
    type: "resetAlarm";
};

export type ClientCommand = 
    | MoveCommand 
    | HomeCommand
    | StopCommand 
    | ResetAlarmCommand;