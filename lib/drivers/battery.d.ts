import { Driver } from "../core";
declare global {
    interface Navigator {
        getBattery(): Promise<IBatteryManagerInternal>;
    }
}
export interface IBatteryStatus {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
}
declare type IBatteryManagerInternalEvent = "chargingchange" | "levelchange" | "chargingtimechange" | "dischargingtimechange";
export interface IBatteryManagerInternal extends IBatteryStatus {
    addEventListener(event: IBatteryManagerInternalEvent, listener: EventListener): void;
}
export declare class BatteryDriver extends Driver {
    private status;
    constructor();
    private updateStatus;
    initialize(): Promise<void>;
    getStatus(): IBatteryStatus;
}
export {};
//# sourceMappingURL=battery.d.ts.map