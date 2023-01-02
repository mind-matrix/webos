import { Driver } from "../core";

declare global {
    interface Navigator {
        getBattery(): Promise<IBatteryManagerInternal>
    }
}

export interface IBatteryStatus {
    charging: boolean
    chargingTime: number
    dischargingTime: number
    level: number
}

type IBatteryManagerInternalEvent = "chargingchange"|"levelchange"|"chargingtimechange"|"dischargingtimechange"

export interface IBatteryManagerInternal extends IBatteryStatus {
    addEventListener(event: IBatteryManagerInternalEvent, listener: EventListener): void
}

export class BatteryDriver extends Driver {
    private status: IBatteryStatus

    constructor() {
        super()
        if (!('getBattery' in navigator)) {
            throw new Error("Battery Status is not supported")
        }
    }

    private async updateStatus() {
        const battery = await navigator.getBattery()
        this.status = {
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime,
            level: battery.level
        } as IBatteryStatus
        return battery
    }

    async initialize() {
        const battery = await this.updateStatus()
        battery.addEventListener("chargingchange", async () => {
            await this.updateStatus()
        })
        battery.addEventListener("chargingtimechange", async () => {
            await this.updateStatus()
        })
        battery.addEventListener("dischargingtimechange", async () => {
            await this.updateStatus()
        })
        battery.addEventListener("levelchange", async () => {
            await this.updateStatus()
        })
    }

    getStatus() {
        return this.status
    }
}