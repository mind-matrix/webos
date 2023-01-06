import { Calculator, Clock, OpenMap, Settings } from "./applications";
import { Process, Service, Driver, Application, stdlib } from "./core";
import { EventManager } from "./core/event";
import { BatteryDriver, DatabaseDriver, NetworkDriver } from "./drivers";
import { ApplicationManagerService } from "./services";
import { SettingsManagerService } from "./services/settings-manager";
import { StateManager } from "./state";
import "./styles.scss"
import { Page, RouteGuard, Router, Widget, XApplication } from "./x-application";

export enum Priority {
    HIGH,
    NORMAL
}

export interface ServiceDescriptor {
    service: typeof Service,
    priority: Priority
}

export interface ProcessDescriptor {
    process: Process,
    priority: Priority
}

const DEFAULT_SERVICE_DESCRIPTORS: ServiceDescriptor[] = [
    { service: ApplicationManagerService, priority: Priority.HIGH },
    { service: SettingsManagerService, priority: Priority.NORMAL },
]

const DEFAULT_DRIVERS: (typeof Driver)[] = [
    DatabaseDriver,
    BatteryDriver,
    NetworkDriver
]

export interface WebOSConfiguration {
    VRAM: {
        sizeBytes: number
    }
}

const DEFAULT_OS_CONFIGURATION: WebOSConfiguration = {
    VRAM: {
        sizeBytes: 0
    }
}

interface WindowWithWebOSGlobals {
    stdlib: typeof stdlib
    Driver: typeof Driver
    Service: typeof Service
    Application: typeof Application
    XApplication: typeof XApplication
    Page: typeof Page
    Router: typeof Router
    RouteGuard: typeof RouteGuard
    Widget: typeof Widget
}

declare global {
    function requestIdleCallback(callback: any, options?: any): number;
}

export interface ExternalXApplicationManifest {
    name: string,
    scripts: string[]
}

export class WebOS {
    private applications: Map<string, typeof Application>
    private services: Map<string, ProcessDescriptor>
    private drivers: Map<string, Driver>
    private eventManager: EventManager
    private stateManager: StateManager
    constructor(private configuration: WebOSConfiguration = DEFAULT_OS_CONFIGURATION) {
        this.applications = new Map()
        this.services = new Map()
        this.drivers = new Map()
        this.eventManager = new EventManager()
        this.stateManager = new StateManager()
        for (const driverType of DEFAULT_DRIVERS) {
            const driver = new driverType()
            this.drivers.set(driver.constructor.name, driver)
        }
        for (const descriptor of DEFAULT_SERVICE_DESCRIPTORS) {
            const process = new descriptor.service()
            this.services.set(process.constructor.name, { process, priority: descriptor.priority })
        }
        this.register([
            Calculator,
            Clock,
            Settings,
            OpenMap
        ])
    }

    get EventManager() {
        return this.eventManager
    }

    get StateManager() {
        return this.stateManager
    }

    get Drivers() {
        return new Map(this.drivers)
    }

    get InstalledApplications() {
        return this.applications
    }

    async updateService(name: string) {
        const service = this.services.get(name)
        await service.process.onBeforeUpdate()
        await service.process.onUpdated()
        if (service.priority === Priority.HIGH) {
            requestAnimationFrame(() => this.updateService(name))
        } else if (service.priority === Priority.NORMAL) {
            requestIdleCallback(() => this.updateService(name))
        } else {
            throw new Error("invalid service priority")
        }
    }

    async updateDriver(name: string) {
        const driver = this.drivers.get(name)
        await driver.poll()
        requestIdleCallback(() => this.updateDriver(name))
    }

    async start() {
        for (const [name, driver] of this.drivers.entries()) {
            await driver.initialize()
            this.updateDriver(name)
        }
        for (const [name, service] of this.services.entries()) {
            await service.process.onCreated()
            this.updateService(name)
        }
        this.exposeGlobals()
    }

    private exposeGlobals() {
        (window as unknown as WindowWithWebOSGlobals).stdlib = stdlib;
        (window as unknown as WindowWithWebOSGlobals).Driver = Driver;
        (window as unknown as WindowWithWebOSGlobals).Service = Service;
        (window as unknown as WindowWithWebOSGlobals).Application = Application;
        (window as unknown as WindowWithWebOSGlobals).XApplication = XApplication;
        (window as unknown as WindowWithWebOSGlobals).Page = Page;
        (window as unknown as WindowWithWebOSGlobals).Router = Router;
        (window as unknown as WindowWithWebOSGlobals).RouteGuard = RouteGuard;
        (window as unknown as WindowWithWebOSGlobals).Widget = Widget;
    }

    register(application: typeof Application | typeof Application[]) {
        if (Array.isArray(application)) {
            for (const app of application) {
                this.applications.set(app.name, app)
            }
            return
        }
        this.applications.set(application.name, application)
    }

    async installScript(url: string) {
        return await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script")
            script.onload = () => {
                resolve()
            }
            script.onerror = reject
            script.src = url
        })
    }

    useStylesheet(url: string) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = url
        link.type = "text/css"
        document.querySelector("head").appendChild(link)
    }

    unuseStylesheet(url: string) {
        document.querySelector(`head > link[href="${url}"`).remove()
    }

    async install(manifestOrManifestUrl: string | object) {
        let manifest: ExternalXApplicationManifest
        if (typeof manifestOrManifestUrl === "string") {
            const manifestUrl = manifestOrManifestUrl
            manifest = await (await fetch(manifestUrl)).json()
        } else {
            manifest = manifestOrManifestUrl as ExternalXApplicationManifest
        }
        for (const scriptUrl of manifest.scripts) {
            await this.installScript(scriptUrl)
        }
        this.register(window[manifest.name])
    }
}