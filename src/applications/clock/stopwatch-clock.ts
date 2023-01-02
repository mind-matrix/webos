import { Page, Router } from "../../x-application";
import template from "./stopwatch-clock.html";
import styles from "./stopwatch-clock.scss";

export class StopwatchClock extends Page {
    private expression: HTMLElement
    private buttonPanel: HTMLDivElement
    private expressionTokens: string[]

    constructor(router: Router) {
        super(router)
        this.ui.innerHTML = template
        
        this.expressionTokens = []
        this.expression = this.ui.querySelector("#expression")

        const linkButtons = this.ui.querySelectorAll("button[x-link]")
        for (const button of linkButtons) {
            button.addEventListener("click", () => {
                const target = button.getAttribute("x-target")
                this.router.navigate(target)
            })
        }
        this.buttonPanel = this.ui.querySelector(".button-panel")
        for (const button of this.buttonPanel.children) {
            button.addEventListener("click", this.createButtonPressListener(button as HTMLButtonElement))
        }
    }

    private createButtonPressListener(button: HTMLButtonElement) {
        return (e: Event) => {
            if (button.textContent === "AC") {
                this.expressionTokens = []
            } else if (button.textContent === "⌫") {
                this.expressionTokens.pop()
            } else if (button.textContent === "+/-") {
                // TODO: Handle
            } else if (button.textContent === "=") {
                const expressionString = this.expressionTokens.join("")
                try {
                    this.expressionTokens = [eval(expressionString)]
                } catch (e) {
                    console.error("Invalid expression")
                }
            } else {
                this.expressionTokens.push(button.textContent)
            }
        }
    }

    onBeforeMount() {
        styles.use()
    }

    onBeforeUnmount() {
        styles.unuse()
    }

    onUpdated() {
        this.expression.textContent = this.expressionTokens.join("")
    }
}