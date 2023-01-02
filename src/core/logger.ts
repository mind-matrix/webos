export class Logger {
    constructor(private tag: string, private logger=console.log) { }
    debug(...args) {
        this.logger(`[${new Date()}] D/${this.tag}: `, ...args)
    }
    error(...args) {
        this.logger(`[${new Date()}] E/${this.tag}: `, ...args)
    }
    warn(...args) {
        this.logger(`[${new Date()}] W/${this.tag}: `, ...args)
    }
}