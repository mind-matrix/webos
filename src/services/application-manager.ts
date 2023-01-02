import { HomeScreen, NavigationPanel, NotificationPanel } from "../applications";
import { Application, Service } from "../core";
import { StateType } from "../state";
import html2canvas from "html2canvas";

interface StartApplicationDetail {
    application: typeof Application
}

interface ApplicationDetail {
    name: string
}

interface ApplicationEvent<T> extends Event {
    detail: T
}

export interface ApplicationManagerState {
    foregroundApplication: string
    activeApplications: string[]
    applicationSnapshots: Map<string, string>
}

export class ApplicationManagerService extends Service {
    private static APPLICATION_MANAGER_EVENTS = "APPLICATION_MANAGER_EVENTS"
    private static APPLICATION_MANAGER_STATE = "APPLICATION_MANAGER_STATE"
    applications: Map<string, Application>
    applicationSnapshots: Map<string, string>
    private foregroundApplication: string
    private readonly DEFAULT_OVERLAY_PANNELS: (typeof Application)[] = [
        NavigationPanel,
        NotificationPanel
    ]
    private DEFAULT_APPLICATION: typeof Application = HomeScreen
    private ui: HTMLElement
    private overlayPanels: Map<string, Application>
    private onNextUpdateListeners: (() => Promise<void>|void)[]
    constructor() {
        super()
        this.applications = new Map()
        this.applicationSnapshots = new Map()
        this.overlayPanels = new Map()
        this.onNextUpdateListeners = []
    }

    get foregroundApplicationName() {
        return this.foregroundApplication
    }

    private async startDefaultApplication() {
        const defaultApplication = new this.DEFAULT_APPLICATION()
        this.applications.set(this.DEFAULT_APPLICATION.name, defaultApplication)
        await defaultApplication.onCreated()
        this.foregroundApplication = this.DEFAULT_APPLICATION.name
        await this.mountForegroundApplication()
    }

    private async startDefaultOverlayPanels() {
        for (const overlayPanel of this.DEFAULT_OVERLAY_PANNELS) {
            const panel = new overlayPanel()
            this.overlayPanels.set(panel.constructor.name, panel)
            await panel.onCreated()
            await this.mountPanel(panel.constructor.name)
        }
    }

    private async mountPanel(name: string) {
        const panel = this.overlayPanels.get(name)
        await panel.onBeforeMount()
        document.body.appendChild(panel.ui)
        await panel.onMounted()
    }

    private async unmountForegroundApplication() {
        if (!this.foregroundApplication) return
        console.log("Unmounting ", this.foregroundApplication)
        const application = this.applications.get(this.foregroundApplication)
        if (application) {
            await application.onBeforeUnmount()
            document.body.removeChild(this.ui)
            await application.onUnmount()
        } else {
            console.error("Application is not loaded")
        }
    }

    private async mountForegroundApplication() {
        if (!this.foregroundApplication) return
        console.log("Mounting ", this.foregroundApplication)
        const application = this.applications.get(this.foregroundApplication)
        if (application) {
            await application.onBeforeMount()
            this.ui = application.ui
            document.body.appendChild(this.ui)
            await application.onMounted()
            requestIdleCallback(this.updateForegroundApplicationSnapshot.bind(this))
        } else {
            console.error("Application is not loaded")
        }
    }

    private async beforeUpdateForegroundApplication() {
        if (!this.foregroundApplication) return
        const application = this.applications.get(this.foregroundApplication)
        await application.onBeforeUpdate()
    }

    private async beforeUpdateOverlayPanels() {
        for (const [_, panel] of this.overlayPanels) {
            await panel.onBeforeUpdate()
        }
    }

    private async updateForegroundApplication() {
        if (!this.foregroundApplication) return
        const application = this.applications.get(this.foregroundApplication)
        await application.onUpdated()
    }

    private async updateOverlayPanels() {
        for (const [_, panel] of this.overlayPanels) {
            await panel.onUpdated()
        }
    }

    private async start(process: typeof Application) {
        if (this.applications.has(process.name)) {
            if (this.foregroundApplication === process.name) return
            this.show(process.name)
        } else {
            const application = new process()
            this.applications.set(process.name, application)
            await application.onCreated()
            await this.unmountForegroundApplication()
            this.foregroundApplication = process.name
            await this.mountForegroundApplication()
        }
    }

    private async stop(name: string) {
        if (this.foregroundApplication === name) {
            await this.unmountForegroundApplication()
        }
        const application = this.applications.get(name)
        await application.onBeforeExit()
        this.applications.delete(name)
        this.applicationSnapshots.delete(name)
        if (this.foregroundApplication === name) {
            await this.show(this.DEFAULT_APPLICATION.name)
        }
    }

    private async show(name: string) {
        if (this.foregroundApplication === name) return
        if (this.foregroundApplication && this.applications.has(this.foregroundApplication)) {
            await this.unmountForegroundApplication()
        }
        this.foregroundApplication = name
        await this.mountForegroundApplication()
    }

    private async updateForegroundApplicationSnapshot() {
        const canvas = await html2canvas(document.body.querySelector("main"))
        this.applicationSnapshots.set(this.foregroundApplication, canvas.toDataURL())
    }

    async onCreated() {
        try {
            document.body.requestFullscreen()
        } catch (e) {
            // pass
        }
        window.WebOS.EventManager.create(ApplicationManagerService.APPLICATION_MANAGER_EVENTS)
        const bus = window.WebOS.EventManager.get(ApplicationManagerService.APPLICATION_MANAGER_EVENTS)
        bus.addEventListener("START_APPLICATION", (event: ApplicationEvent<StartApplicationDetail>) => {
            this.onNextUpdateListeners.push(() => {
                this.start(event.detail.application)
            })
        })
        bus.addEventListener("STOP_APPLICATION", (event: ApplicationEvent<ApplicationDetail>) => {
            this.onNextUpdateListeners.push(() => {
                this.stop(event.detail.name)
            })
        })
        bus.addEventListener("SHOW_APPLICATION", (event: ApplicationEvent<ApplicationDetail>) => {
            this.onNextUpdateListeners.push(() => {
                this.show(event.detail.name)
            })
        })
        window.WebOS.StateManager.create(StateType.SHARED_IMMUTABLE, ApplicationManagerService.APPLICATION_MANAGER_STATE, this)
        this.onNextUpdateListeners.push(async () => {
            await this.startDefaultApplication()
            await this.startDefaultOverlayPanels()
            requestIdleCallback(this.updateForegroundApplicationSnapshot.bind(this))
        })
    }

    async onBeforeUpdate() {
        await this.beforeUpdateForegroundApplication()
        await this.beforeUpdateOverlayPanels()
    }

    async onUpdated() {
        await this.updateForegroundApplication()
        await this.updateOverlayPanels()
        for (const listener of this.onNextUpdateListeners) {
            await listener()
        }
        window.WebOS.StateManager.update<ApplicationManagerState>(StateType.SHARED_IMMUTABLE, ApplicationManagerService.APPLICATION_MANAGER_STATE, this, {
            foregroundApplication: this.foregroundApplication,
            activeApplications: Array.from(this.applications.keys()),
            applicationSnapshots: this.applicationSnapshots
        })
        this.onNextUpdateListeners = []
        if (this.foregroundApplication && this.applications.has(this.foregroundApplication)) {
            requestIdleCallback(this.updateForegroundApplicationSnapshot.bind(this))
        }
    }

    async onBeforeExit() {
    }
}