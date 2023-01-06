import { Application } from "../core";
export declare class Widget extends Application {
    private children;
    constructor(tag?: string, children?: Widget[]);
    onCreated(): Promise<void>;
    onBeforeMount(): Promise<void>;
    onMounted(): Promise<void>;
    onBeforeUpdate(): Promise<void>;
    onUpdated(): Promise<void>;
    onBeforeUnmount(): Promise<void>;
    onUnmount(): Promise<void>;
}
//# sourceMappingURL=widget.d.ts.map