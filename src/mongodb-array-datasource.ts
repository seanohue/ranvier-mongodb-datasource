import MongoDbDataSource from "./mongodb-datasource";
import { MongoDbDataSourceConfig } from "./types";

export default class MongoDbArrayDataSource extends MongoDbDataSource {
  /**
   * The constructor of the DataSource takes two parameters:
   *   config: the value of 'config' from the `dataSources` configuration in
   *           ranvier.json
   *
   *   rootPath: A string representing the project root directory (the same
   *             directory that contains ranvier.json)
   */
  constructor(config = {} as MongoDbDataSourceConfig, rootPath) {
    super(config);
  }

  /*
  The first parameter of each method from here on will be the config defined in
  the 'entityLoaders' entry. For example:

    "entityLoaders": {
      "items": {
        "source": "MongoDb",
        "config": {
          "table": "items"
        },
      }
    }

    `config` would equal `{ collection: "items" }`

    Each method also returns a `Promise`
  */

  /**
   * Returns whether or not the configured collection has records
   */
  async hasData(config = {} as MongoDbDataSourceConfig) {
    const collection = await this.findCollection(config);
    return Boolean(collection.length);
  }

  /**
   * Returns all entries for a given config.
   */
  async fetchAll(config = {} as MongoDbDataSourceConfig) {
    return this.findCollection(config);
  }

  /**
   * Gets a specific record by id for a given config
   * @param {Object} config
   * @param {string} id
   * @return {Promise<any>}
   */
  async fetch(config = {} as MongoDbDataSourceConfig, id: string) {
    console.log('Fetching with ', config, id);
    return this.findObject(config, id);
  }

  /**
   * Perform a full replace of all data for a given config. This is the write
   * version of fetchAll
   */
  async replace(config = {} as MongoDbDataSourceConfig, data: any) {
    return this.replaceCollection(config, data);;
  }

  /**
   * Update specific record. Write version of `fetch`
   */
  async update(config = {} as MongoDbDataSourceConfig, id: string, data: any) {
    return this.replaceObject(config, id, data);
  }

  /**
   * Delete simply overwrites with `null`
   */
  async delete(config = {} as MongoDbDataSourceConfig, id: string) {
    return this.update(config, id, null);
  }
}
