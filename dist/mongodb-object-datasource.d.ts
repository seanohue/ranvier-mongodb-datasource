import { MongoDbDataSourceConfig } from "./types";
import MongoDbDataSource from "./mongodb-datasource";
import { Document, WithId } from "mongodb";
export default class MongoDbObjectDataSource extends MongoDbDataSource {
    /**
     * Returns all entries for a given config.
     */
    fetchAll(config?: MongoDbDataSourceConfig): Promise<Record<string | number, WithId<Document>>>;
    /**
     * Perform a full replace of all data for a given config. This is the write
     * version of fetchAll
     */
    replace(config: MongoDbDataSourceConfig, data: any): Promise<import("mongodb").DeleteResult>;
}
