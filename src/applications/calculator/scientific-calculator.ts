import { Page, Router } from "../../x-application";
import template from "./scientific-calculator.html"
import styles from "./scientific-calculator.scss"

export class ScientificCalculator extends Page {
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