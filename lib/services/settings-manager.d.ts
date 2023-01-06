import { Service } from "../core";
export interface SettingsState {
    display: {
        wallpapers: {
            homeScreen: string;
        };
    };
}
export declare class SettingsManagerService extends Service {
    private static SETTINGS_MANAGER_EVENTS;
    private static SETTINGS_MANAGER_STATE;
    private static SETTINGS_DATABASE;
    private static SETTINGS_STATE_ENTRY_ID;
    private bus;
    private database;
    private onNextUpdateListeners;
    constructor();
    onCreated(): Promise<void>;
    onBeforeUpdate(): void;
    onUpdated(): Promise<void>;
}
//# sourceMappingURL=settings-manager.d.ts.map