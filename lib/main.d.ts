import { WebOS } from "./webos";
import { Application, Driver, Service, stdlib } from "./core";
import { Page, RouteGuard, Router, Widget, XApplication } from "./x-application";
declare global {
    interface Window {
        WebOS: WebOS;
        Application: typeof Application;
        Service: typeof Service;
        Driver: typeof Driver;
        XApplication: typeof XApplication;
        RouteGuard: typeof RouteGuard;
        Router: typeof Router;
        Page: typeof Page;
        Widget: typeof Widget;
        stdlib: typeof stdlib;
    }
}
//# sourceMappingURL=main.d.ts.map