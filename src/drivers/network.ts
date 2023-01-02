import { Driver } from "../core";

declare global {
    interface Navigator {
        connection: INetworkConnection
    }
}

export interface INetworkConnectionStatus {
    effectiveType: "4g"|"3g"|"2g"|"slow-2g"
}

export interface INetworkConnection extends INetworkConnectionStatus {
    onchange: () => void | Promise<void>
}

export class NetworkDriver extends Driver {
    status: INetworkConnectionStatus
    constructor() {
        super()
        if (!('connection' in navigator)) {
            throw new Error("Network Status is not supported")
        }
    }

    private async updateStatus() {
        const connection = navigator.connection
        this.status = {
            effectiveType: connection.effectiveType
        }
        return connection
    }

    async initialize() {
        const connection = await this.updateStatus()
        connection.onchange = async () => {
            await this.updateStatus()
        }
    }

    getStatus() {
        return this.status
    }
}