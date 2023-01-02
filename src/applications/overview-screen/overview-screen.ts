import { Application } from "../../core";
import { ApplicationManagerState, SettingsState } from "../../services";
import { StateType } from "../../state";
import template from "./overview-screen.html"
import styles from "./overview-screen.scss"

export class OverviewScreen extends Application {
    private applications: HTMLElement
    private static CLOSE_APP_OFFSET = 100
    constructor() {
        super()
        this.ui.innerHTML = template
        this.applications = this.ui.querySelector("#applications")
    }

    onBeforeMount() {
        styles.use()
        const settingsState = window.WebOS.StateManager.read<SettingsState>(StateType.SHARED_IMMUTABLE, "SETTINGS_MANAGER_STATE", this)
        if (settingsState.display?.wallpapers?.homeScreen) {
            const backgroundImage = `url(${settingsState.display.wallpapers.homeScreen})`
            if (document.body.style.backgroundImage !== backgroundImage) {
                document.body.style.backgroundImage = backgroundImage
            }
        }
    }

    onBeforeUnmount() {
        styles.unuse()
        document.body.style.backgroundImage = null
    }

    onUpdated(): void | Promise<void> {
        const settingsState = window.WebOS.StateManager.read<SettingsState>(StateType.SHARED_IMMUTABLE, "SETTINGS_MANAGER_STATE", this)
        if (settingsState.display?.wallpapers?.homeScreen) {
            const backgroundImage = `url(${settingsState.display.wallpapers.homeScreen})`
            if (document.body.style.backgroundImage !== backgroundImage) {
                document.body.style.backgroundImage = backgroundImage
            }
        }
        const applicationManagerState = window.WebOS.StateManager.read<ApplicationManagerState>(StateType.SHARED_IMMUTABLE, "APPLICATION_MANAGER_STATE", this)
        const applications = applicationManagerState.activeApplications.filter(application => ["HomeScreen","OverviewScreen"].findIndex(app => app === application) === -1)
        for (const application of applications) {
            const existingApplicationInfoContainer = this.applications.querySelector(`#${application}`)
            if (existingApplicationInfoContainer) {
                (existingApplicationInfoContainer.querySelector("img") as HTMLImageElement).src = applicationManagerState.applicationSnapshots.get(application)
            } else {
                const applicationInfoContainer = document.createElement("figure")
                applicationInfoContainer.id = application
                const applicationPreview = document.createElement("img")
                applicationPreview.src = applicationManagerState.applicationSnapshots.get(application)
                const applicationName = document.createElement("caption")
                applicationName.textContent = application
                applicationInfoContainer.appendChild(applicationPreview)
                applicationInfoContainer.appendChild(applicationName)
                applicationInfoContainer.addEventListener("click", () => {
                    const applicationManagerEventsBus = window.WebOS.EventManager.get("APPLICATION_MANAGER_EVENTS")
                    applicationManagerEventsBus.dispatchEvent(new CustomEvent("SHOW_APPLICATION", {
                        detail: {
                            name: application
                        }
                    }))
                })
                applicationInfoContainer.addEventListener("touchstart", (e) => applicationInfoContainer.setAttribute("x-touchY", e.changedTouches[0].screenY.toString()))
                applicationInfoContainer.addEventListener("touchmove", (e) => {
                    const startY = parseInt(applicationInfoContainer.getAttribute("x-touchY")??"0")
                    applicationInfoContainer.style.transform = `translate3d(0, -${startY-e.changedTouches[0].screenY}px, 0)`
                })
                applicationInfoContainer.addEventListener("touchend", (e) => {
                    applicationInfoContainer.style.transform = null
                    const startY = parseInt(applicationInfoContainer.getAttribute("x-touchY")??"0")
                    const endY = e.changedTouches[0].screenY
                    if (startY-endY > OverviewScreen.CLOSE_APP_OFFSET) {
                        const applicationManagerEventsBus = window.WebOS.EventManager.get("APPLICATION_MANAGER_EVENTS")
                        applicationManagerEventsBus.dispatchEvent(new CustomEvent("STOP_APPLICATION", {
                            detail: {
                                name: application
                            }
                        }))
                    }
                })
                applicationInfoContainer.addEventListener("dragstart", (e) => applicationInfoContainer.setAttribute("x-dragY", e.offsetY.toString()))
                applicationInfoContainer.addEventListener("dragover", (e) => {
                    const startY = parseInt(applicationInfoContainer.getAttribute("x-dragY"))
                    applicationInfoContainer.style.transform = `translate3d(0, -${startY-e.offsetY}px, 0)`
                })
                applicationInfoContainer.addEventListener("dragend", (e) => {
                    applicationInfoContainer.style.transform = null
                    const startY = parseInt(applicationInfoContainer.getAttribute("x-dragY"))
                    const endY = e.offsetY
                    if (startY-endY > OverviewScreen.CLOSE_APP_OFFSET) {
                        const applicationManagerEventsBus = window.WebOS.EventManager.get("APPLICATION_MANAGER_EVENTS")
                        applicationManagerEventsBus.dispatchEvent(new CustomEvent("STOP_APPLICATION", {
                            detail: {
                                name: application
                            }
                        }))
                    }
                })
                this.applications.appendChild(applicationInfoContainer)
            }
        }
        for (const child of this.applications.children) {
            if (applications.findIndex(application => application === child.id) === -1) child.remove()
        }
    }
}