import MongoDbDataSource from "./mongodb-datasource";
import { MongoDbDataSourceConfig } from "./types";
export default class MongoDbArrayDataSource extends MongoDbDataSource {
    /**
     * Params:
     *   config: the value of 'config' from the `dataSources` configuration in
     *           ranvier.json
     */
    constructor(config?: MongoDbDataSourceConfig);
    /**
     * Returns whether or not the configured collection has records
     */
    hasData(config?: MongoDbDataSourceConfig): Promise<boolean>;
    /**
     * Returns all entries for a given config.
     */
    fetchAll(config?: MongoDbDataSourceConfig): Promise<import("mongodb").WithId<import("bson").Document>[]>;
    /**
     * Gets a specific record by id for a given config
     * @param {Object} config
     * @param {string} id
     * @return {Promise<any>}
     */
    fetch(config: MongoDbDataSourceConfig, id: string): Promise<import("mongodb").WithId<import("bson").Document>>;
    /**
     * Perform a full replace of all data for a given config. This is the write
     * version of fetchAll
     */
    replace(config: MongoDbDataSourceConfig, data: any): Promise<import("mongodb").DeleteResult>;
    /**
     * Update specific record. Write version of `fetch`
     */
    update(config: MongoDbDataSourceConfig, id: string, data: any): Promise<import("bson").Document>;
    /**
     * Delete simply overwrites with `null`
     */
    delete(config: MongoDbDataSourceConfig, id: string): Promise<import("bson").Document>;
}
