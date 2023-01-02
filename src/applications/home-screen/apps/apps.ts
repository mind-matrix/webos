import { Widget } from "../../../x-application";
import template from "./apps.html";
import styles from "./apps.scss";

export class Apps extends Widget {
    private apps: HTMLDivElement
    private static DEFAULT_APP_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyklEQVR4nO2YSw6CQBBE31FkLqYmikdwy5IbuxwzBBMXooEZMhheJb3s6hBq+lMgtocAtMB9ZqScpjb/GXgAcWGk3FMt/pBJ/l6kqcDPrQD5K64V+OkKFugq8OMH4B9ACUUfMXahaBvFQYaTmAWrRFuwjV4q8PP36zTjsZB7cByZxtr8A5px3+5nRso58Btr8wuxewR9oWnoC6EvxOKDQ18IjS2yfBslhBJCCcVCJ2X3acxrr2MXYt8SagsW0Bfiu7WiL9TrCwkGPAEcVnD0KpAtaAAAAABJRU5ErkJggg==";

    constructor() {
        super("div")
        this.ui.innerHTML = template
        this.apps = this.ui.querySelector(".apps")
    }
    async onBeforeMount() {
        styles.use()
        await super.onBeforeMount()
    }
    async onBeforeUnmount() {
        styles.unuse()
        await super.onBeforeUnmount()
    }
    async onUpdated() {
        await super.onUpdated()
        const applications = window.WebOS.InstalledApplications
        for (const [name, application] of applications.entries()) {
            if (this.apps.querySelector(`#${name}`)) continue
            const applicationLauncher = document.createElement("figure")
            applicationLauncher.id = name
            const applicationIcon = document.createElement("img")
            applicationIcon.src = (application as any).APP_ICON??Apps.DEFAULT_APP_ICON
            const applicationText = document.createElement("caption")
            applicationText.textContent = name
            applicationLauncher.appendChild(applicationIcon)
            applicationLauncher.appendChild(applicationText)
            this.apps.appendChild(applicationLauncher)
            applicationLauncher.addEventListener("click", () => {
                const bus = window.WebOS.EventManager.get("APPLICATION_MANAGER_EVENTS")
                bus.dispatchEvent(new CustomEvent("START_APPLICATION", { detail: { application } }))
            })
        }
    }
}