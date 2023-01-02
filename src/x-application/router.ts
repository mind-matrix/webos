import { Page } from "./page";
import { RouteGuard } from "./route-guard";
import { XApplication } from "./x-application";

export type Route = { path: string, page: typeof Page, canActivate?: RouteGuard }
export type RouteHistory = { path: string, instance: Page, canActivate?: RouteGuard }

export class Router {
    private current: { path: string, instance: Page } | null
    private history: RouteHistory[]
    private boundBackButtonListener: () => Promise<void>
    
    constructor(private xApplication: XApplication, private routes: Route[]) {
        this.current = null
        this.history = []
        this.boundBackButtonListener = this.back.bind(this)
    }

    async onCreated() {
        const startPage = new (this.routes.find(route => route.path === "").page)(this)
        await startPage.onCreated()
        this.xApplication.load(startPage)
        this.current = { path: "", instance: startPage }
        const navPanelEventsBus = window.WebOS.EventManager.get("NAVIGATION_PANEL_EVENTS")
        navPanelEventsBus.addEventListener("BACK_PRESSED", this.boundBackButtonListener)
    }

    async navigate(path: string) {
        for (const route of this.routes) {
            if (route.path === path) {
                if (!route.canActivate || await route.canActivate.canActivate()) {
                    if (this.current) this.history.push({ ...this.current, canActivate: route.canActivate })
                    const instance = new route.page(this)
                    await instance.onCreated()
                    this.xApplication.load(instance)
                    this.current = {
                        path: route.path,
                        instance
                    }
                    return true
                }
            }
        }
        return false
    }
    
    async back() {
        if (!this.history.length) {
            console.log("Closing App")
            const applicationManagerEventsBus = window.WebOS.EventManager.get("APPLICATION_MANAGER_EVENTS")
            applicationManagerEventsBus.dispatchEvent(new CustomEvent("SHOW_APPLICATION", {
                detail: {
                    name: "HomeScreen"
                }
            }))
            return
        }
        const { path, instance, canActivate } = this.history.pop()
        if (!canActivate || await canActivate.canActivate()) {
            this.xApplication.load(instance)
            this.current = {
                path,
                instance
            }
        }
    }

    async onBeforeExit() {
        const navPanelEventsBus = window.WebOS.EventManager.get("NAVIGATION_PANEL_EVENTS")
        navPanelEventsBus.removeEventListener("BACK_PRESSED", this.boundBackButtonListener)
        for (const route of this.history) {
            await route.instance.onBeforeExit()
        }
    }
}