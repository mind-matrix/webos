import { Service } from "../core";
import { EventBus } from "../core/event";
import { DatabaseDriver } from "../drivers";
import { StateType } from "../state";

type SettingsUpdate = DeepPartial<SettingsState>

interface SettingsEvent<T> extends Event {
    detail: T
}

export interface SettingsState {
    display: {
        wallpapers: {
            homeScreen: string
        }
    }
}

interface DatabaseSettingsState {
    _id: string
    settings: SettingsState
}

const DEFAULT_SETTINGS_STATE: SettingsState = {
    display: {
        wallpapers: {
            homeScreen: null
        }
    }
}

export class SettingsManagerService extends Service {
    private static SETTINGS_MANAGER_EVENTS = "SETTINGS_MANAGER_EVENTS"
    private static SETTINGS_MANAGER_STATE = "SETTINGS_MANAGER_STATE"
    private static SETTINGS_DATABASE = "SETTINGS_DATABASE"
    private static SETTINGS_STATE_ENTRY_ID = "USER_SETTINGS"
    private bus: EventBus
    private database: DatabaseDriver
    private onNextUpdateListeners: (() => Promise<void>|void)[]
    constructor() {
        super()
        this.onNextUpdateListeners = []
    }

    async onCreated() {
        this.database = window.WebOS.Drivers.get("DatabaseDriver") as DatabaseDriver
        window.WebOS.EventManager.create(SettingsManagerService.SETTINGS_MANAGER_EVENTS)
        this.bus = window.WebOS.EventManager.get(SettingsManagerService.SETTINGS_MANAGER_EVENTS)
        window.WebOS.StateManager.create<SettingsState>(StateType.SHARED_IMMUTABLE, SettingsManagerService.SETTINGS_MANAGER_STATE, this)
        const currentDatabaseState = await this.database.get<DatabaseSettingsState>(SettingsManagerService.SETTINGS_DATABASE, SettingsManagerService.SETTINGS_STATE_ENTRY_ID)
        if (!currentDatabaseState) {
            await this.database.insert(SettingsManagerService.SETTINGS_DATABASE, {
                    _id: SettingsManagerService.SETTINGS_STATE_ENTRY_ID,
                    settings: DEFAULT_SETTINGS_STATE
                })
        } else {
            const currentState = currentDatabaseState.settings
            window.WebOS.StateManager.update<SettingsState>(StateType.SHARED_IMMUTABLE, SettingsManagerService.SETTINGS_MANAGER_STATE, this, currentState)
        }
        this.bus.addEventListener("STATE_UPDATE", (event: SettingsEvent<SettingsUpdate>) => {
            window.WebOS.StateManager.update(StateType.SHARED_IMMUTABLE, SettingsManagerService.SETTINGS_MANAGER_STATE, this, event.detail)
            this.onNextUpdateListeners.push(async () => {
                const updatedState = window.WebOS.StateManager.read<SettingsState>(StateType.SHARED_IMMUTABLE, SettingsManagerService.SETTINGS_MANAGER_STATE, this)
                await this.database.update(SettingsManagerService.SETTINGS_DATABASE, SettingsManagerService.SETTINGS_STATE_ENTRY_ID, {
                    _id: SettingsManagerService.SETTINGS_STATE_ENTRY_ID,
                    settings: updatedState
                })
            })
        })
    }

    onBeforeUpdate() {}

    async onUpdated() {
        for (const listener of this.onNextUpdateListeners) {
            await listener()
        }
        this.onNextUpdateListeners = []
    }
}