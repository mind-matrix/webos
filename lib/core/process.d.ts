import { Logger } from "./logger";
export declare abstract class Process {
    protected readonly logger: Logger;
    constructor();
    abstract onCreated(): Promise<void> | void;
    abstract onBeforeUpdate(): Promise<void> | void;
    abstract onUpdated(): Promise<void> | void;
    abstract onBeforeExit(): Promise<void> | void;
}
export declare class Service extends Process {
    constructor();
    onCreated(): void;
    onBeforeUpdate(): void;
    onUpdated(): void;
    onBeforeExit(): void;
}
export declare class Application extends Process {
    ui: HTMLElement;
    constructor(tag?: string);
    onCreated(): void | Promise<void>;
    onBeforeMount(): void | Promise<void>;
    onMounted(): void | Promise<void>;
    onBeforeUpdate(): void | Promise<void>;
    onUpdated(): void | Promise<void>;
    onBeforeUnmount(): void | Promise<void>;
    onUnmount(): void | Promise<void>;
    onBeforeExit(): void | Promise<void>;
}
//# sourceMappingURL=process.d.ts.map