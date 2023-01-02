import { Process, SharedImmutableState, SharedMutableState } from "../core";

export enum StateType {
    SHARED_IMMUTABLE,
    SHARED_MUTABLE
}

export class StateManager {
    private states: {
        sharedImmutable: Map<string, SharedImmutableState>
        sharedMutable: Map<string, SharedMutableState>
    }
    constructor() {
        this.states = {
            sharedImmutable: new Map(),
            sharedMutable: new Map()
        }
    }
    create<T>(type: StateType, name: string, owner: Process) {
        if (type === StateType.SHARED_IMMUTABLE) {
            this.states.sharedImmutable.set(name, new SharedImmutableState(owner))
        } else if (type === StateType.SHARED_MUTABLE) {
            this.states.sharedMutable.set(name, new SharedMutableState([owner]))
        }
    }
    update<T=Object>(type: StateType, name: string, process: Process, ...updates: T[]) {
        if (type === StateType.SHARED_IMMUTABLE) {
            const state = this.states.sharedImmutable.get(name)
            if (state.isOwner(process)) {
                state.update(...updates)
            }
        } else if (type === StateType.SHARED_MUTABLE) {
            const state = this.states.sharedMutable.get(name)
            if (state.hasWriteAccess(process)) {
                state.update(...updates)
            }
        }
    }
    read<T=Object>(type: StateType, name: string, process: Process) {
        if (type === StateType.SHARED_IMMUTABLE) {
            const state = this.states.sharedImmutable.get(name)
            return state.read() as T
        }
    }
}