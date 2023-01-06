export declare class Logger {
    private tag;
    private logger;
    constructor(tag: string, logger?: (...data: any[]) => void);
    debug(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
}
//# sourceMappingURL=logger.d.ts.map