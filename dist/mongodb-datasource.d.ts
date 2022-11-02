import { MongoClient } from "mongodb";
import { MongoDbDataSourceConfig, MongoDbIdentity, MongoDbIdentityFilter } from "./types";
export default class MongoDbDataSource {
    /**
     * The constructor of the DataSource takes two parameters:
     *    config: the value of 'config' from the `dataSources` configuration in
     *    ranvier.json
     *
     *    example:
     *    {
     *      host: "192.168.1.1",
     *      name: "myDatabase",
     *      user: "myUser",
     *      pass: "password",
     *    }
     *
     *    warning: see the ranvier website for security information concerning
     *    using .env files and ranvier.conf.js to protect your database information.
     *
     *    https://ranviermud.com/extending/entity_loaders/#sensitive-data
     */
    client: null | MongoClient;
    config: MongoDbDataSourceConfig;
    constructor(config?: MongoDbDataSourceConfig);
    init(): Promise<void>;
    get uri(): string;
    replaceCollection(config: MongoDbDataSourceConfig, data: any): Promise<import("mongodb").DeleteResult>;
    replaceObject(config: MongoDbDataSourceConfig, id: string, data: any): Promise<import("bson").Document>;
    findCollection(config: MongoDbDataSourceConfig): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    findObject(config: MongoDbDataSourceConfig, id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    clientCollection(config: MongoDbDataSourceConfig): Promise<import("mongodb").Collection<import("bson").Document>>;
    close(): Promise<void>;
    buildIdentity(config: MongoDbDataSourceConfig, id?: string | number): MongoDbIdentity;
    buildIdFilter(config: MongoDbDataSourceConfig, id?: string): MongoDbIdentityFilter;
}
