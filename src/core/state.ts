import { Process } from "./process";

export abstract class State {}

export class SharedImmutableState extends State {
    private state: Object
    constructor(private owner: Process) {
        super()
        this.state = {}
    }
    isOwner(process: Process) {
        return process === this.owner
    }
    update(...updates: any[]) {
        this.state = Object.assign(this.state, ...updates)
    }
    read() {
        return Object.assign({}, this.state)
    }
}

export class SharedMutableState extends State {
    private state: Object
    private writers: Set<Process>
    constructor(writers: Process[]) {
        super()
        this.state = {}
        this.writers = new Set(writers)
    }
    addWriter(process: Process) {
        this.writers.add(process)
    }
    removeWriter(process: Process) {
        this.writers.delete(process)
    }
    hasWriteAccess(process: Process) {
        return this.writers.has(process)
    }
    update(...updates: any[]) {
        this.state = Object.assign(this.state, ...updates)
    }
    read() {
        return Object.assign({}, this.state)
    }
}