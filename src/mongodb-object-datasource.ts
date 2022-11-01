import { MongoDbDataSourceConfig } from "./types";

const MongoDbArrayDataSource = require("./mongodb-array-datasource");

class MongoDbObjectDataSource extends MongoDbArrayDataSource {
  /**
   * Returns all entries for a given config.
   */
  async fetchAll(config = {} as MongoDbDataSourceConfig) {
    const results = await this.findCollection(config);

    /* Data should output as a dictionary, convert from array. */
    return results?.reduce((output, result) => {
      const key = result.id || result._id.id;
      if (!key && key !== 0) {
        throw new Error(`Invalid key for datasource fetchAll result, got ${key}: ` + JSON.stringify(result));
      }

      output[key] = result;
      return output;
    }, {}) || {};
  }

  /**
   * Perform a full replace of all data for a given config. This is the write
   * version of fetchAll
   */
  async replace(config = {} as MongoDbDataSourceConfig, data: any) {
    /* Data should come in as a dictionary, convert to array. */
    const dataArray = Array.from(Object.values(data));
    const results =  await this.replaceCollection(config, dataArray);
  }
}

module.exports = MongoDbObjectDataSource;
