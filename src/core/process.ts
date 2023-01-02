import { Logger } from "./logger"

export abstract class Process {
    protected readonly logger: Logger
    
    constructor() {
        this.logger = new Logger(this.constructor.name)
    }

    abstract onCreated(): Promise<void>|void
    abstract onBeforeUpdate(): Promise<void>|void
    abstract onUpdated(): Promise<void>|void
    abstract onBeforeExit(): Promise<void>|void
}

export class Service extends Process {
    constructor() {
        super()
    }

    onCreated() {
        throw new Error("Not implemented")
    }

    onBeforeUpdate() {
        throw new Error("Not implemented")
    }

    onUpdated() {
        throw new Error("Not implemented")
    }

    onBeforeExit() {
        throw new Error("Not implemented")
    }
}

export class Application extends Process {
    ui: HTMLElement
    constructor(tag: string = "main") {
        super()
        this.ui = document.createElement(tag)
    }
    onCreated(): void | Promise<void> {}
    onBeforeMount(): void | Promise<void> {} // before mounted to foreground
    onMounted(): void | Promise<void> {} // mounted to foreground
    onBeforeUpdate(): void | Promise<void> {}
    onUpdated(): void | Promise<void> {}
    onBeforeUnmount(): void | Promise<void> {} // before unmount to background
    onUnmount(): void | Promise<void> {} // unmounted to background
    onBeforeExit(): void | Promise<void> {}
}
