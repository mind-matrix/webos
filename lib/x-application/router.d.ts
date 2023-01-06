import { Page } from "./page";
import { RouteGuard } from "./route-guard";
import { XApplication } from "./x-application";
export declare type Route = {
    path: string;
    page: typeof Page;
    canActivate?: RouteGuard;
};
export declare type RouteHistory = {
    path: string;
    instance: Page;
    canActivate?: RouteGuard;
};
export declare class Router {
    private xApplication;
    private routes;
    private current;
    private history;
    private boundBackButtonListener;
    constructor(xApplication: XApplication, routes: Route[]);
    onCreated(): Promise<void>;
    navigate(path: string): Promise<boolean>;
    back(): Promise<void>;
    onBeforeExit(): Promise<void>;
}
//# sourceMappingURL=router.d.ts.map