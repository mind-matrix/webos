import { Process } from "../core";
export declare enum StateType {
    SHARED_IMMUTABLE = 0,
    SHARED_MUTABLE = 1
}
export declare class StateManager {
    private states;
    constructor();
    create<T>(type: StateType, name: string, owner: Process): void;
    update<T = Object>(type: StateType, name: string, process: Process, ...updates: T[]): void;
    read<T = Object>(type: StateType, name: string, process: Process): T;
}
//# sourceMappingURL=state-manager.d.ts.map