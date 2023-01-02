import { XApplication } from "../../x-application"
import { SettingsMenu } from "./settings-menu"

export class Settings extends XApplication {
    constructor() {
        super([
            { path: "", page: SettingsMenu },
        ])
    }
    static get APP_ICON() {
        return "data:image/png;base64,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"
    }
}