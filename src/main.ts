import { WebOS } from "./webos"
import styles from "./styles.scss"

declare global {
    interface Window {
        WebOS: WebOS
    }
}

styles.use()

const bootButton = document.querySelector("#boot")
bootButton.addEventListener("click", () => {
    bootButton.remove()
    window.WebOS = new WebOS()
    window.WebOS.start()
})