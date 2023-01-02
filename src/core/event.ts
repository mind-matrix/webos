export interface EventBus {
    dispatchEvent(event: Event): boolean
    addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
}

export class EventManager {
    buses: Map<string, EventBus>
    constructor() {
        this.buses = new Map()
    }
    create(name: string) {
        if (this.buses.has(name)) return
        const bus = new Comment(name)
        this.buses.set(name, bus)
    }
    get(name: string) {
        if (!this.buses.has(name)) throw new Error("Event Bus does not exist")
        return this.buses.get(name)
    }
    delete(name: string) {
        this.buses.delete(name)
    }
}