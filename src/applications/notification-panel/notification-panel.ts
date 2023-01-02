import { Application } from "../../core";
import { BatteryDriver, NetworkDriver } from "../../drivers";
import template from "./notification-panel.html"
import styles from "./notification-panel.scss"

export interface NotificationEvent<T extends HTMLElement> extends Event {
    detail: {
        notification: T
    }
}

export class NotificationPanel extends Application {
    private batteryLevelIndicatorIcon: HTMLImageElement
    private batteryLevelIndicatorText: HTMLSpanElement
    private fullscreenNotificationPanel: HTMLDivElement
    private brightnessSlider: HTMLInputElement
    private notificationClock: HTMLTimeElement
    private notifications: HTMLElement

    private static FULLSCREEN_DRAG_THRESHOLD = 100
    private static NOTIFICATION_DRAG_THRESHOLD = 50
    
    private static BATTERY_CHARGING_IMG_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACjklEQVR4nO2YvWsUURTFfxIwNmKsLAw2ohYSrNxEED8QQUQEwU6x2wh2q6JomhQuWIiIZSDYJPkHYixMGxPSWEoakyakSCcY/AjJyoWzMISdN+/Nm4wMzIFb7X3n3TN7534M1KhRo0aNCuAS0AKGqCAeAR3ZH+A8FcIx4EdCgNkbKoQPe4I3e1XGxReAx8DzHHZGHJYqOz0ENPX7TQeH3T2SJ/AB4FOPS31tFTgEHACWUnyu6y6fe+YUkzdigje7I54HDp9T8vnmyWkivNMmJvh58RwGNlJ8LKX69Q9tBXAP+wh4EhH8NnBWPK8dfuuJ6hTCb+9EJsYjBLwTx0ngt8NvQX7Dgfzj+ylgEzgqjtkM36ke9x4HXgC/MtLTqtMocKRoAUZquOHh23Y8wMvAXw+O72ki8gj4CvQBB4GVnA9gGTihGCYCH1qUgF3gYgEFoJNIrdsx70SogBnHvBNqn8V1rSwBP4FBnZuMDL4D3BPXs7IEjGXMOyG2qMZmI8haGQLWEvPOYmTwO4n9YCzgXJSAp/K/X0DqTIprUGlZioAr8p+PDN5efCsAqCB0yhJwS/7TkQKs9KJSvFumAGs2qPks5wx+Rc2vT80w9HxUI9tW209D24PDxg7DaI7gCxklbPB6megFSUxlnLWBDw2Am573LWhMb+7HMNe1hni+OHzss8pp+b2Pzfm9iJ1nuhVl3eFjTxEtP5aKhS40IxHBb6mx9Ts684bWzTwluIEn5nIKsAUdLexpPrboo8U/hPsjARjIKcK+ZqBPJr1+X0rMO6sBvLOhn1VI7Kwt5ayP3dW5Zsa8c86TrxWSNkWi7Zh3KoG3jnmnEmio1ncFPKSCGFLdvvq/A6lRo0aNGmThH1h9jJn8djUuAAAAAElFTkSuQmCC"
    private static BATTERY_FULL_IMG_SRC =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA60lEQVR4nO2YMQ7CMBAEpwj/gHcEKuAdUAA9iRBtSt5HBzwkdIciuUAWQkosYlvsSNvv2ufT+UAIIYQQ6TEB1kAFnEdSBayAItT8AngAFkl3YB5i/hnRvDk9h4SYRD55+3ATvcppnYBp87TsE+CUgGHzVPcJ0CRg2Dxd37rUAZjlFsA8tcA25wDmQsxyDmDAPvcAjQKgG0AlpEeMuhB/20Z3OQdocx4lWmCT2zh9cermnylfqBMwbJ66TcX/fCkL95G2RHQbsiOaJ7RWKRlI6dLHPPmSQAq35ju+dYFf6+hqPni1KIQQQghG4gU1cBz8Wi95fwAAAABJRU5ErkJggg=="
    
    private networkConnectionIndicatorIcon: HTMLImageElement
    private networkConnectionIndicatorText: HTMLSpanElement

    private static NETWORK_4G = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMUlEQVR4nGNgGAXDBfzHgUctoF4Q/SdgwKgFDBQHEaUG/B+14P9oEP0f8qloFAwcAAB3ANcphMfQ1AAAAABJRU5ErkJggg=="
    private static NETWORK_3G = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAOElEQVR4nGNgGAXDBfzHgYeeBTAw+Cz4TyAIRi1goDiIiDXg/6gF/0eDiNap6D+uwo7mFoyCgQMA3sa/QSikjSUAAAAASUVORK5CYII="
    private static NETWORK_2G = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAO0lEQVR4nGNgGAXDBfzHgYeeBTAw+Cz4TyAIho4FMDD4LPhPYRD8H7Xg/2gQ/ScyFf0nU572FoyCgQMAj8qvUcGVT10AAAAASUVORK5CYII="
    private static NETWORK_SLOWER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAQElEQVR4nGNgGAXDBfzHgYeeBTAw+Cz4TyAIho4FMDD4LPhPYRD8HzQWwMCoBf8HLIj+E4jk/2TK096CUTBwAABzh6dZUdmFAAAAAABJRU5ErkJggg=="
    
    private isFullscreenNotificationPanelInForeground: boolean
    private boundedBackButtonPressEvent: () => void
    private currentBrightness: number = 0

    constructor() {
        super("header")
        this.ui.innerHTML = template
        this.batteryLevelIndicatorIcon = this.ui.querySelector("#batteryLevelIndicatorIcon")
        this.batteryLevelIndicatorText = this.ui.querySelector("#batteryLevelIndicatorText")
        this.networkConnectionIndicatorIcon = this.ui.querySelector("#networkConnectionIndicatorIcon")
        this.networkConnectionIndicatorText = this.ui.querySelector("#networkConnectionIndicatorText")
        this.fullscreenNotificationPanel = this.ui.querySelector(".fullscreen_notification_panel")
        this.brightnessSlider = this.ui.querySelector("#brightnessSlider")
        this.notifications = this.ui.querySelector("#notifications")
        this.notificationClock = this.ui.querySelector("#notificationClock")
    }

    createNotification(notification: HTMLElement) {
        if (this.notifications.textContent) {
            this.notifications.textContent = null
        }
        notification.addEventListener("touchstart", (e) => {
            const startX = e.changedTouches[0].clientX
            notification.setAttribute("startX", startX.toString())
        })
        notification.addEventListener("touchmove", (e) => {
            const startX = parseFloat(notification.getAttribute("startX"))
            const currentX = e.changedTouches[0].clientX
            notification.style.transform = `translate3d(${currentX-startX}px, 0, 0)`
        })
        notification.addEventListener("touchend", (e) => {
            const startX = parseFloat(notification.getAttribute("startX"))
            const endX = e.changedTouches[0].clientX
            if (endX - startX > NotificationPanel.NOTIFICATION_DRAG_THRESHOLD) {
                notification.style.transform = `translate3d(100%, 0, 0)`
                notification.remove()
            } else {
                notification.style.transform = null
            }
        })
        notification.addEventListener("dragstart", (e) => {
            const startX = e.clientX
            notification.setAttribute("startX", startX.toString())
        })
        notification.addEventListener("dragover", (e) => {
            const startX = parseFloat(notification.getAttribute("startX"))
            const currentX = e.clientX
            notification.style.transform = `translate3d(${currentX-startX}px, 0, 0)`
        })
        notification.addEventListener("dragend", (e) => {
            const startX = parseFloat(notification.getAttribute("startX"))
            const endX = e.clientX
            if (endX - startX > NotificationPanel.NOTIFICATION_DRAG_THRESHOLD) {
                notification.style.transform = `translate3d(100%, 0, 0)`
                notification.remove()
            } else {
                notification.style.transform = null
            }
        })
        this.notifications.appendChild(notification)
    }

    onCreated(): void | Promise<void> {
        this.boundedBackButtonPressEvent = this.onBackButtonPressed.bind(this)
        const navPanelEventsBus = window.WebOS.EventManager.get("NAVIGATION_PANEL_EVENTS")
        navPanelEventsBus.addEventListener("BACK_PRESSED", this.boundedBackButtonPressEvent)

        window.WebOS.EventManager.create("NOTIFICATION_PANEL_EVENTS")
        const notificationBus = window.WebOS.EventManager.get("NOTIFICATION_PANEL_EVENTS")
        notificationBus.addEventListener("PUSH_NOTIFY", (e: NotificationEvent<HTMLElement>) => {
            this.createNotification(e.detail.notification)
        })

        this.ui.addEventListener("touchstart", (e) => {
            if (!this.isFullscreenNotificationPanelInForeground) {
                const startY = e.changedTouches[0].clientY
                const startTransformY = new DOMMatrixReadOnly(window.getComputedStyle(this.fullscreenNotificationPanel).transform).m42
                this.ui.setAttribute("startY", startY.toString())
                this.ui.setAttribute("startTransformY", startTransformY.toString())
            }
        })
        this.ui.addEventListener("touchmove", (e) => {
            if (!this.isFullscreenNotificationPanelInForeground) {
                requestAnimationFrame(() => {
                    const startTransformY = parseFloat(this.ui.getAttribute("startTransformY"))
                    this.fullscreenNotificationPanel.style.transform = `translate3d(0, ${startTransformY + e.changedTouches[0].clientY}px, 0)`
                })
            }
        })
        this.ui.addEventListener("touchend", (e) => {
            console.log("ended pull")
            if (!this.isFullscreenNotificationPanelInForeground) {
                const startY = parseFloat(this.ui.getAttribute("start")??"0")
                const endY = e.changedTouches[0].clientY
                if (endY - startY > NotificationPanel.FULLSCREEN_DRAG_THRESHOLD) {
                    requestAnimationFrame(() => {
                        this.fullscreenNotificationPanel.style.transform = `translate3d(0, 0, 0)`
                        this.isFullscreenNotificationPanelInForeground = true
                    })
                } else {
                    this.fullscreenNotificationPanel.style.transform = null
                    this.isFullscreenNotificationPanelInForeground = false
                }
            }
        })
    }

    onBackButtonPressed(e: Event) {
        if (this.isFullscreenNotificationPanelInForeground) {
            e.stopImmediatePropagation()
            this.fullscreenNotificationPanel.style.transform = null
            this.isFullscreenNotificationPanelInForeground = false
        }
    }

    onBeforeMount() {
        styles.use()
    }
    onBeforeUnmount() {
        styles.unuse()
    }
    
    updateBatteryIndicator() {
        const batteryDriver = window.WebOS.Drivers.get("BatteryDriver") as BatteryDriver
        const status = batteryDriver.getStatus()
        
        if (status.charging) this.batteryLevelIndicatorIcon.src = NotificationPanel.BATTERY_CHARGING_IMG_SRC
        else this.batteryLevelIndicatorIcon.src = NotificationPanel.BATTERY_FULL_IMG_SRC
        
        this.batteryLevelIndicatorText.textContent = `${(status.level * 100).toFixed(0).toString()}%`
    }

    updateNetworkIndicator() {
        const networkDriver = window.WebOS.Drivers.get("NetworkDriver") as NetworkDriver
        const status = networkDriver.getStatus()

        if (status.effectiveType === "4g") this.networkConnectionIndicatorIcon.src = NotificationPanel.NETWORK_4G
        else if (status.effectiveType === "3g") this.networkConnectionIndicatorIcon.src = NotificationPanel.NETWORK_3G
        else if (status.effectiveType === "2g") this.networkConnectionIndicatorIcon.src = NotificationPanel.NETWORK_2G
        else this.networkConnectionIndicatorIcon.src = NotificationPanel.NETWORK_SLOWER

        if (status.effectiveType !== "slow-2g") this.networkConnectionIndicatorText.textContent = status.effectiveType.toUpperCase()
        else this.networkConnectionIndicatorText.textContent = ""
    }

    updateBrightness() {
        const brightness = parseFloat(this.brightnessSlider.value)/100
        if (this.currentBrightness !== brightness) {
            this.currentBrightness = brightness
            document.querySelector("html").style.filter = `brightness(${this.currentBrightness})`
        }
    }

    private pad(n: number, width: number, z: string = '0') {
        const num = n.toString();
        return num.length >= width ? num : new Array(width - num.length + 1).join(z) + num;
    }
    
    updateClock() {
        const date = new Date()
        const hours24 = date.getHours()
        const hours12 = hours24 % 12
        const isAM = hours24 < 12
        const h = this.pad(hours12, 2)
        const m = this.pad(date.getMinutes(), 2)
        this.notificationClock.textContent = `${h}:${m} ${isAM?'AM':'PM'}`
    }

    onUpdated() {
        this.updateBatteryIndicator()
        this.updateNetworkIndicator()
        this.updateBrightness()
        this.updateClock()
    }
}