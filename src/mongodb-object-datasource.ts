import { MongoDbDataSourceConfig } from "./types";;
import MongoDbDataSource from "./mongodb-datasource";
import { Document, WithId } from "mongodb";

// FIXME: May need to add some methods "lost" from the array datasource class. Those can be moved to base.
export default class MongoDbObjectDataSource extends MongoDbDataSource {
  /**
   * Returns all entries for a given config.
   */
  async fetchAll(config = {} as MongoDbDataSourceConfig) {
    const results = await this.findCollection(config);

    /* Data should output as a dictionary, convert from array. */
    return results?.reduce((output, result) => {
      const key: string | number = result.id || result._id.id;
      if (!key && key !== 0) {
        throw new Error(`Invalid key for datasource fetchAll result, got ${key}: ` + JSON.stringify(result));
      }

      output[key] = result;
      return output;
    }, {} as Record<string | number, WithId<Document>>);
  }

  async hasData(config = {} as MongoDbDataSourceConfig) {
    const collection = await this.findCollection(config);
    return Boolean(collection.length);
  }

  /**
   * Perform a full replace of all data for a given config. This is the write
   * version of fetchAll
   */
  async replace(config = {} as MongoDbDataSourceConfig, data: any) {
    /* Data should come in as a dictionary, convert to array. */
    const dataArray = Array.from(Object.values(data));
    return this.replaceCollection(config, dataArray);
  }
}
