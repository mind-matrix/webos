import { Application } from "../../core";
import { OverviewScreen } from "../overview-screen";
import styles from "./navigation-panel.scss";

export class NavigationPanel extends Application {
    private buttonList: HTMLDivElement
    private buttonGroupClass: string
    private backButton: HTMLButtonElement
    private homeButton: HTMLButtonElement
    private overviewButton: HTMLButtonElement
    constructor() {
        super("footer")
        this.buttonList = document.createElement("div")
        this.buttonList.id = "navpanel_btnList"

        this.buttonGroupClass = "navpanel_btnGrp"
        
        this.backButton = document.createElement("button")
        this.backButton.textContent = "‹"
        this.backButton.id = "navpanel_backBtn"
        this.backButton.classList.add(this.buttonGroupClass)

        this.homeButton = document.createElement("button")
        this.homeButton.textContent = "⌂"
        this.homeButton.id = "navpanel_homeBtn"
        this.homeButton.classList.add(this.buttonGroupClass)

        this.overviewButton = document.createElement("button")
        this.overviewButton.textContent = "＝"
        this.overviewButton.id = "navpanel_overviewBtn"
        this.overviewButton.classList.add(this.buttonGroupClass)

        this.buttonList.appendChild(this.backButton)
        this.buttonList.appendChild(this.homeButton)
        this.buttonList.appendChild(this.overviewButton)

        this.ui.appendChild(this.buttonList)
    }

    async onCreated() {
        const applicationManagerEventsBus = window.WebOS.EventManager.get("APPLICATION_MANAGER_EVENTS")
        window.WebOS.EventManager.create("NAVIGATION_PANEL_EVENTS")
        const navPanelEventsBus = window.WebOS.EventManager.get("NAVIGATION_PANEL_EVENTS")
        
        this.backButton.addEventListener("click", () => {
            navPanelEventsBus.dispatchEvent(new CustomEvent("BACK_PRESSED"))
        })
        this.homeButton.addEventListener("click", () => {
            applicationManagerEventsBus.dispatchEvent(new CustomEvent("SHOW_APPLICATION", {
                detail: {
                    name: "HomeScreen"
                }
            }))
        })
        this.overviewButton.addEventListener("click", () => {
            applicationManagerEventsBus.dispatchEvent(new CustomEvent("START_APPLICATION", {
                detail: {
                    application: OverviewScreen
                }
            }))
        })
    }

    async onBeforeMount() {
        styles.use()
    }

    async onBeforeUnmount() {
        styles.unuse()
    }
}