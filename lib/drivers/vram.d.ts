/// <reference types="@types/wicg-file-system-access" />
import { Driver } from "../core";
export interface IVramOptions {
    VramFileHandle: FileSystemFileHandle;
    VramSizeBytes: number;
}
export interface IProcessContext {
    position: number;
    size: number;
}
export interface IStoreProcessContextRequest {
    processId: string;
    data: ArrayBuffer;
}
export interface IVramDriverOptions {
    VramSizeBytes: number;
}
export declare class Vram {
    fileHandle: FileSystemFileHandle;
    sizeBytes: number;
    constructor(VramDriverOptions: IVramOptions);
    getMaxBlockSize(): Promise<number>;
    initialize(): Promise<void>;
    store(context: ArrayBuffer, position: number): Promise<void>;
    retrieve(position: number, size: number): Promise<ArrayBuffer>;
}
export declare class VramDriver extends Driver {
    private _sizeBytes;
    private _contexts;
    private _vram;
    constructor(VramManagerOptions: IVramDriverOptions);
    get sizeBytes(): number;
    get contexts(): Map<string, IProcessContext>;
    get vram(): Vram;
    initialize(): Promise<void>;
    private getFreeBlockPosition;
    store(request: IStoreProcessContextRequest): Promise<void>;
    retrieve(processId: string): Promise<ArrayBuffer>;
}
//# sourceMappingURL=vram.d.ts.map