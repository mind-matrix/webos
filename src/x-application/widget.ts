import { Application } from "../core";

export class Widget extends Application {
    constructor(tag: string = "div", private children: Widget[] = []) {
        super(tag)
        for (const child of this.children) {
            this.ui.appendChild(child.ui)
        }
    }
    async onCreated() {
        for (const child of this.children) {
            await child.onCreated()
        }
    }
    async onBeforeMount() {
        for (const child of this.children) {
            await child.onBeforeMount()
        }
    }
    async onMounted() {
        for (const child of this.children) {
            await child.onMounted()
        }
    }
    async onBeforeUpdate() {
        for (const child of this.children) {
            await child.onBeforeUpdate()
        }
    }
    async onUpdated() {
        for (const child of this.children) {
            await child.onUpdated()
        }
    }
    async onBeforeUnmount() {
        for (const child of this.children) {
            await child.onBeforeUnmount()
        }
    }
    async onUnmount() {
        for (const child of this.children) {
            await child.onUnmount()
        }
    }
}