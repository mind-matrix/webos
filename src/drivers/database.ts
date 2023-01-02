import { Driver } from "../core"
import PouchDB from "pouchdb"

declare global {
    interface IDBDatabaseInfo {
        name?: string;
        version?: number;
    }
    interface IDBFactory {
        databases(): Promise<IDBDatabaseInfo[]>
    }
}

export interface IDatabaseOptions {
    name: string
    tables?: ICreateTableOptions[]
}

export interface ICreateTableOptions {
    name: string
    primaryKey: string
}

export interface IGetTransactionOptions {
    tables: string[],
    mode: IDBTransactionMode
}

export interface IInsertTableOptions<T> {
    table: string,
    data: T
}

export interface IGetTableOptions {
    table: string,
    key: string | number
}

export interface IUpdateTableOptions<T> {
    table: string,
    data: T
}

export interface IDeleteTableOptions {
    table: string,
    key: string | number
}

export interface IDropTableOptions {
    name: string
}

export class DatabaseDriver extends Driver {

    constructor() {
        super()
        if (!('indexedDB' in window)) {
            throw new Error("IndexedDB is not supported")
        }
    }

    async create(name: string) {
        const database = new PouchDB(name)
    }

    async insert<T>(databaseName: string, data: T) {
        const database = new PouchDB(databaseName)
        if (database) {
            return await new Promise<void>((resolve, reject) => {
                database.put(data).then(() => {
                    resolve()
                }).catch((e) => reject(e))
            })
        } else {
            throw new Error("database not found")
        }
    }

    async get<T>(databaseName: string, _id: string) {
        const database = new PouchDB(databaseName)
        if (database) {
            return await new Promise<T>((resolve, reject) => {
                database.get(_id).then(async (data) => {
                    await database.close()
                    resolve(data as unknown as T)
                }).catch((e) => {
                    if (e.message === "missing") resolve(null)
                    else reject(e)
                })
            })
        } else {
            throw new Error("database not found")
        }
    }

    async update<T>(databaseName: string, _id: string, data: T) {
        const database = new PouchDB(databaseName)
        if (database) {
            return await new Promise<void>((resolve, reject) => {
                database.get(_id).then((doc) => {
                    doc = { ...data, _id: doc._id, _rev: doc._rev }
                    database.put(doc).then(async () => {
                        database.close()
                        resolve()
                    }).catch((e) => reject(e))
                }).catch((e) => reject(e))
            })
        } else {
            throw new Error("database not found")
        }
    }

    async delete(databaseName: string, _id: string) {
        const database = new PouchDB(databaseName)
        if (database) {
            return await new Promise<void>((resolve, reject) => {
                database.get(_id).then((doc) => {
                    database.remove(doc).then(async () => {
                        await database.close()
                        resolve()
                    }).catch((e) => reject(e))
                }).catch((e) => reject(e))
            })
        } else {
            throw new Error("database not found")
        }
    }

    async drop(databaseName: string) {
        const database = new PouchDB(databaseName)
        if (database) {
            return await new Promise<void>((resolve, reject) => {
                database.destroy().then(async () => {
                    await database.close()
                    resolve()
                }).catch((e) => reject(e))
            })
        } else {
            throw new Error("database not found")
        }
    }
}