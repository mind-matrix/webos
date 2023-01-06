import { Application, Driver, Service, stdlib } from "./core";
import { WebOS } from "./webos";
import { Page, RouteGuard, Router, Widget, XApplication } from "./x-application";

export interface WindowWithWebOSLibraries {
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

declare global {
    interface Window extends WindowWithWebOSLibraries {}
}

export {
    Application,
    Driver,
    Service,
    stdlib,
    Page,
    RouteGuard,
    Router,
    Widget,
    XApplication
}