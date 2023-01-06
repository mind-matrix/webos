import { Driver } from "../core";
declare global {
    interface IDBDatabaseInfo {
        name?: string;
        version?: number;
    }
    interface IDBFactory {
        databases(): Promise<IDBDatabaseInfo[]>;
    }
}
export interface IDatabaseOptions {
    name: string;
    tables?: ICreateTableOptions[];
}
export interface ICreateTableOptions {
    name: string;
    primaryKey: string;
}
export interface IGetTransactionOptions {
    tables: string[];
    mode: IDBTransactionMode;
}
export interface IInsertTableOptions<T> {
    table: string;
    data: T;
}
export interface IGetTableOptions {
    table: string;
    key: string | number;
}
export interface IUpdateTableOptions<T> {
    table: string;
    data: T;
}
export interface IDeleteTableOptions {
    table: string;
    key: string | number;
}
export interface IDropTableOptions {
    name: string;
}
export declare class DatabaseDriver extends Driver {
    constructor();
    create(name: string): Promise<void>;
    insert<T>(databaseName: string, data: T): Promise<void>;
    get<T>(databaseName: string, _id: string): Promise<T>;
    update<T>(databaseName: string, _id: string, data: T): Promise<void>;
    delete(databaseName: string, _id: string): Promise<void>;
    drop(databaseName: string): Promise<void>;
}
//# sourceMappingURL=database.d.ts.map