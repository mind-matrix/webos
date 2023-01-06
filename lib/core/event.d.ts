export interface EventBus {
    dispatchEvent(event: Event): boolean;
    addEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
export declare class EventManager {
    buses: Map<string, EventBus>;
    constructor();
    create(name: string): void;
    get(name: string): EventBus;
    delete(name: string): void;
}
//# sourceMappingURL=event.d.ts.map