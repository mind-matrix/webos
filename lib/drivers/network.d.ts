import { Driver } from "../core";
declare global {
    interface Navigator {
        connection: INetworkConnection;
    }
}
export interface INetworkConnectionStatus {
    effectiveType: "4g" | "3g" | "2g" | "slow-2g";
}
export interface INetworkConnection extends INetworkConnectionStatus {
    onchange: () => void | Promise<void>;
}
export declare class NetworkDriver extends Driver {
    status: INetworkConnectionStatus;
    constructor();
    private updateStatus;
    initialize(): Promise<void>;
    getStatus(): INetworkConnectionStatus;
}
//# sourceMappingURL=network.d.ts.map