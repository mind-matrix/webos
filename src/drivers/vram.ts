import { Driver } from "../core"

const DEFAULT_VRAM_MANAGER_OPTIONS: IVramDriverOptions = {
    VramSizeBytes: 2 * 1024 * 1024 * 1024
}

const DEFAULT_VRAM_OPTIONS: IVramOptions = {
    VramFileHandle: null,
    VramSizeBytes: DEFAULT_VRAM_MANAGER_OPTIONS.VramSizeBytes
}

export interface IVramOptions {
    VramFileHandle: FileSystemFileHandle
    VramSizeBytes: number
}

export interface IProcessContext {
    position: number
    size: number
}

export interface IStoreProcessContextRequest {
    processId: string
    data: ArrayBuffer
}

export interface IVramDriverOptions {
    VramSizeBytes: number
}

export class Vram {
    fileHandle: FileSystemFileHandle
    sizeBytes: number

    constructor (VramDriverOptions: IVramOptions) {
        const options = Object.assign(DEFAULT_VRAM_OPTIONS, VramDriverOptions)
        if (!options.VramFileHandle) {
            throw new Error("invalid vram size")
        }
        this.fileHandle = options.VramFileHandle
        this.sizeBytes = options.VramSizeBytes
    }

    async getMaxBlockSize(): Promise<number> {
        let currentBlockSize = this.sizeBytes
        while (true) {
            try {
                new ArrayBuffer(currentBlockSize)
                return currentBlockSize
            } catch (e) {
                if (e instanceof RangeError) {
                    currentBlockSize = Math.floor(currentBlockSize/2)
                } else {
                    throw e
                }
            }
        }
    }

    async initialize() {
        const writer = await this.fileHandle.createWritable()
        const maxBlockSize = await this.getMaxBlockSize()
        const nBlocks = this.sizeBytes / maxBlockSize
        for (let i=0; i < nBlocks; i++) {
            await writer.write(new ArrayBuffer(maxBlockSize))
        }
        await writer.close()
    }

    async store(context: ArrayBuffer, position: number) {
        if (position + context.byteLength > this.sizeBytes) {
            throw new RangeError("context buffer out of range")
        }
        const writer = await this.fileHandle.createWritable({ keepExistingData: true })
        await writer.write({ type: "write", data: context, position })
        await writer.close()
    }

    async retrieve(position: number, size: number) {
        const file = await this.fileHandle.getFile()
        const fileSlice = file.slice(position, position + size)
        const reader = new FileReader
        return new Promise<ArrayBuffer>((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result as ArrayBuffer)
            reader.onerror = (e) => reject(e.target.error)
            reader.readAsArrayBuffer(fileSlice)
        })
    }

}

export class VramDriver extends Driver {
    private _sizeBytes: number
    private _contexts: Map<string, IProcessContext>
    private _vram: Vram

    constructor(VramManagerOptions: IVramDriverOptions) {
        super()
        const options = Object.assign(DEFAULT_VRAM_MANAGER_OPTIONS, VramManagerOptions)
        if (!options.VramSizeBytes) {
            throw new Error("invalid VRAM size")
        }
        this._sizeBytes = options.VramSizeBytes
        this._contexts = new Map()
        this._vram = null
    }

    get sizeBytes() {
        return this._sizeBytes
    }

    get contexts() {
        return this._contexts
    }

    get vram() {
        return this._vram
    }

    async initialize() {
        const fileHandle = await window.showSaveFilePicker({
            types: [{
                description: "VRAM File",
                accept: {
                    'application/octet-stream': ['.bin','.img','.dmg','.iso']
                }
            }],
            excludeAcceptAllOption: true,
            suggestedName: "vram",
            multiple: false
        } as SaveFilePickerOptions)
        this._vram = new Vram({
            VramFileHandle: fileHandle,
            VramSizeBytes: this._sizeBytes
        })
        await this._vram.initialize()
    }

    private getFreeBlockPosition(size: number): number {
        let currentBlockPosition = 0
        for (const [_, context] of this._contexts) {
            if (
                (currentBlockPosition > context.position && currentBlockPosition < (context.position + context.size)) ||
                ((currentBlockPosition + size) > context.position && (currentBlockPosition + size) < (context.position + context.size))
            ) {
                currentBlockPosition = context.position + context.size
            }
            if (currentBlockPosition > this._sizeBytes) {
                throw new RangeError("not enough memory")
            }
        }
        return currentBlockPosition
    }

    async store(request: IStoreProcessContextRequest) {
        const freeBlockPosition = this.getFreeBlockPosition(request.data.byteLength)
        this._contexts.set(request.processId, { position: freeBlockPosition, size: request.data.byteLength } as IProcessContext)
        await this._vram.store(request.data, freeBlockPosition)
    }

    async retrieve(processId: string) {
        const context = this._contexts.get(processId)
        return await this._vram.retrieve(context.position, context.size)
    }
}