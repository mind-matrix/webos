import { Page, Router } from "../../x-application";
import template from "./timer-clock.html"
import styles from "./timer-clock.scss"

export class TimerClock extends Page {
    constructor(router: Router) {
        super(router)
        this.ui.innerHTML = template
    }

    onBeforeMount() {
        styles.use()
    }

    onBeforeUnmount() {
        styles.unuse()
    }
}