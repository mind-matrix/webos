import { Application, Service } from "../core";
export interface ApplicationManagerState {
    foregroundApplication: string;
    activeApplications: string[];
    applicationSnapshots: Map<string, string>;
}
export declare class ApplicationManagerService extends Service {
    private static APPLICATION_MANAGER_EVENTS;
    private static APPLICATION_MANAGER_STATE;
    applications: Map<string, Application>;
    applicationSnapshots: Map<string, string>;
    private foregroundApplication;
    private readonly DEFAULT_OVERLAY_PANNELS;
    private DEFAULT_APPLICATION;
    private ui;
    private overlayPanels;
    private onNextUpdateListeners;
    constructor();
    get foregroundApplicationName(): string;
    private startDefaultApplication;
    private startDefaultOverlayPanels;
    private mountPanel;
    private unmountForegroundApplication;
    private mountForegroundApplication;
    private beforeUpdateForegroundApplication;
    private beforeUpdateOverlayPanels;
    private updateForegroundApplication;
    private updateOverlayPanels;
    private start;
    private stop;
    private show;
    private updateForegroundApplicationSnapshot;
    onCreated(): Promise<void>;
    onBeforeUpdate(): Promise<void>;
    onUpdated(): Promise<void>;
    onBeforeExit(): Promise<void>;
}
//# sourceMappingURL=application-manager.d.ts.map