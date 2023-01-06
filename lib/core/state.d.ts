import { Process } from "./process";
export declare abstract class State {
}
export declare class SharedImmutableState extends State {
    private owner;
    private state;
    constructor(owner: Process);
    isOwner(process: Process): boolean;
    update(...updates: any[]): void;
    read(): Object;
}
export declare class SharedMutableState extends State {
    private state;
    private writers;
    constructor(writers: Process[]);
    addWriter(process: Process): void;
    removeWriter(process: Process): void;
    hasWriteAccess(process: Process): boolean;
    update(...updates: any[]): void;
    read(): Object;
}
//# sourceMappingURL=state.d.ts.map