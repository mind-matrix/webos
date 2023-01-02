import { Widget } from "../../../x-application"
import styles from "./clock.scss"
import template from "./clock.html"

export class Clock extends Widget {
    private time: HTMLTimeElement
    private date: HTMLTimeElement
    constructor() {
        super("div")
        this.ui.innerHTML = template
        this.time = this.ui.querySelector("time[datetime=time]")
        this.time.textContent = (new Date()).toLocaleTimeString()

        this.date = this.ui.querySelector("time[datetime=date]")
        this.date.textContent = (new Date()).toDateString()
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
        this.time.textContent = (new Date()).toLocaleTimeString()
        this.date.textContent = (new Date()).toDateString()
    }
}