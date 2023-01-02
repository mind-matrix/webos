import { Application } from "../core";
import { Page } from "./page";
import { Route, Router } from "./router";

/**
 * This is an Extended Application with support for Widgets embedded in Pages and Routing b/w Pages.
 */
export class XApplication extends Application {
    protected router: Router
    private page: Page
    private onNextUpdate: () => Promise<void> | void
    constructor(routes: Route[] = []) {
        super()
        this.router = new Router(this, routes)
        this.onNextUpdate = () => {}
    }

    load(page: Page) {
        this.onNextUpdate = async () => {
            if (this.page) {
                await this.page.onBeforeUnmount()
                this.ui.removeChild(this.page.ui)
                await this.page.onUnmount()
            }
            this.page = page
            await this.page.onBeforeMount()
            this.ui.appendChild(this.page.ui)
            await this.page.onMounted()
        }
    }

    async onCreated() {
        await this.router.onCreated()
    }

    async onBeforeMount() {
        if (this.page) await this.page.onBeforeMount()
    }

    async onMounted() {
        if (this.page) await this.page.onMounted()
    }

    async onBeforeUnmount() {
        if (this.page) await this.page.onBeforeUnmount()
    }

    async onUnmount() {
        if (this.page) await this.page.onUnmount()
    }

    async onUpdated() {
        await this.onNextUpdate()
        if (this.page) await this.page.onUpdated()
        this.onNextUpdate = () => {}
    }

    async onBeforeExit() {
        if (this.page) await this.page.onBeforeExit()
        await this.router.onBeforeExit()
    }
}