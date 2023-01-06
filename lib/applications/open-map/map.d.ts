import { Page, Router } from "../../x-application";
export declare class Map extends Page {
    private location;
    private map;
    private onNextUpdateListeners;
    constructor(router: Router);
    onCreated(): Promise<void>;
    onBeforeMount(): void | Promise<void>;
    onBeforeUnmount(): void | Promise<void>;
    onUpdated(): Promise<void>;
}
//# sourceMappingURL=map.d.ts.map