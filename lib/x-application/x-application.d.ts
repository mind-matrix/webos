import { Application } from "../core";
import { Page } from "./page";
import { Route, Router } from "./router";
/**
 * This is an Extended Application with support for Widgets embedded in Pages and Routing b/w Pages.
 */
export declare class XApplication extends Application {
    protected router: Router;
    private page;
    private onNextUpdate;
    constructor(routes?: Route[]);
    load(page: Page): void;
    onCreated(): Promise<void>;
    onBeforeMount(): Promise<void>;
    onMounted(): Promise<void>;
    onBeforeUnmount(): Promise<void>;
    onUnmount(): Promise<void>;
    onUpdated(): Promise<void>;
    onBeforeExit(): Promise<void>;
}
//# sourceMappingURL=x-application.d.ts.map