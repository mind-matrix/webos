import { WebOS } from "./webos"
import styles from "./styles.scss"
import { Application, Driver, Service, stdlib } from "./core"
import { Page, RouteGuard, Router, Widget, XApplication } from "./x-application"

declare global {
    interface Window {
        WebOS: WebOS
        Application: typeof Application
        Service: typeof Service
        Driver: typeof Driver
        XApplication: typeof XApplication
        RouteGuard: typeof RouteGuard
        Router: typeof Router
        Page: typeof Page
        Widget: typeof Widget
        stdlib: typeof stdlib
    }
}

styles.use()

const bootButton = document.querySelector("#boot")
bootButton.addEventListener("click", () => {
    bootButton.remove()
    window.WebOS = new WebOS()
    window.WebOS.start()

    window.Application = Application
    window.Service = Service
    window.Driver = Driver
    window.XApplication = XApplication
    window.RouteGuard = RouteGuard
    window.Router = Router
    window.Page = Page
    window.Widget = Widget
    window.stdlib = stdlib
})