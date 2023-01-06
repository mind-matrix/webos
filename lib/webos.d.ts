import { Process, Service, Driver, Application } from "./core";
import { EventManager } from "./core/event";
import { StateManager } from "./state";
import "./styles.scss";
export declare enum Priority {
    HIGH = 0,
    NORMAL = 1
}
export interface ServiceDescriptor {
    service: typeof Service;
    priority: Priority;
}
export interface ProcessDescriptor {
    process: Process;
    priority: Priority;
}
export interface WebOSConfiguration {
    VRAM: {
        sizeBytes: number;
    };
}
declare global {
    function requestIdleCallback(callback: any, options?: any): number;
}
export interface ExternalXApplicationManifest {
    name: string;
    scripts: string[];
}
export declare class WebOS {
    private configuration;
    private applications;
    private services;
    private drivers;
    private eventManager;
    private stateManager;
    constructor(configuration?: WebOSConfiguration);
    get EventManager(): EventManager;
    get StateManager(): StateManager;
    get Drivers(): Map<string, Driver>;
    get InstalledApplications(): Map<string, typeof Application>;
    updateService(name: string): Promise<void>;
    updateDriver(name: string): Promise<void>;
    start(): Promise<void>;
    private exposeGlobals;
    register(application: typeof Application | typeof Application[]): void;
    installScript(url: string): Promise<void>;
    useStylesheet(url: string): void;
    unuseStylesheet(url: string): void;
    install(manifestOrManifestUrl: string | object): Promise<void>;
}
//# sourceMappingURL=webos.d.ts.map