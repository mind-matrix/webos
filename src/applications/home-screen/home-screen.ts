import { Application } from "../../core";
import styles from "./home-screen.scss";
import { Clock } from "./clock";
import { Apps } from "./apps";
import { StateType } from "../../state";
import { SettingsState } from "../../services";

export class HomeScreen extends Application {
    private clock: Clock
    private apps: Apps
    constructor() {
        super()
        this.clock = new Clock()
        this.apps = new Apps()
        this.ui.appendChild(this.clock.ui)
        this.ui.appendChild(this.apps.ui)
    }

    async onCreated() {
        await this.clock.onCreated()
        await this.apps.onCreated()
    }

    async onBeforeMount() {
        styles.use()
        const settingsState = window.WebOS.StateManager.read<SettingsState>(StateType.SHARED_IMMUTABLE, "SETTINGS_MANAGER_STATE", this)
        if (settingsState.display?.wallpapers?.homeScreen) {
            document.body.style.backgroundImage = `url(${settingsState.display.wallpapers.homeScreen})`
        }
        await this.clock.onBeforeMount()
        await this.apps.onBeforeMount()
    }

    async onBeforeUnmount() {
        styles.unuse()
        document.body.style.backgroundImage = null
        await this.clock.onBeforeUnmount()
        await this.apps.onBeforeUnmount()
    }

    async onUpdated() {
        const settingsState = window.WebOS.StateManager.read<SettingsState>(StateType.SHARED_IMMUTABLE, "SETTINGS_MANAGER_STATE", this)
        if (settingsState.display?.wallpapers?.homeScreen) {
            const backgroundImage = `url(${settingsState.display.wallpapers.homeScreen})`
            if (document.body.style.backgroundImage !== backgroundImage) {
                document.body.style.backgroundImage = backgroundImage
            }
        }
        await this.clock.onUpdated()
        await this.apps.onUpdated()
    }
}