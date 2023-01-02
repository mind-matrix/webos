import { Application } from "../core";
import { Router } from "./router";

export class Page extends Application {
    constructor(protected router: Router) {
        super("div")
    }
}