import { MongoClient } from "mongodb";
import clientConnect from "./client-connect";
import validateDatasourceConfig from "./config-validation";
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
  constructor(config = {} as MongoDbDataSourceConfig) {
    this.config = config;
    validateDatasourceConfig(this.config);
    this.client = null;
  }

  async init() {
    this.client = await clientConnect(this.uri);
  }

  get uri() {
    const user = encodeURIComponent(this.config.user);
    const password = encodeURIComponent(this.config.pass);
    const host = this.config.host;
    const authMechanism = "DEFAULT";
    const db = this.config.name;
    return `mongodb://${user}:${password}@${host}/?authMechanism=${authMechanism}&authSource=${db}`;
  }

  async replaceCollection(config: MongoDbDataSourceConfig, data: any) {
    const collection = await this.clientCollection(config);
        // build filter without id, to capture other stuff in same
        // bundle/area only...
    const cursor = collection.deleteMany(this.buildIdFilter(config))
      .finally(() => {
        data.forEach((v: any) => (v._id = this.buildIdentity(config, v.id)));
        collection.insertMany(data, {});
      });
    return cursor;
  }

  async replaceObject(
    config: MongoDbDataSourceConfig, 
    id: string, 
    data: any,
  ) {
    const collection = await this.clientCollection(config);
    if (data) {
      data._id = this.buildIdentity(config, id);
      return collection.replaceOne(
        { _id: data._id },
        data,
        { upsert: true },
      );
    } else {
      return collection.deleteOne(this.buildIdFilter(config, id));
    }
  }

  async findCollection(config: MongoDbDataSourceConfig) {
    try {
      const collection = await this.clientCollection(config);
      const idFilter = this.buildIdFilter(config);
      console.warn(`Searching collection using idFilter`, idFilter);
      const cursor = collection.find(idFilter);
      return cursor.toArray();
    } catch (e) {
      console.warn('findCollection failed for config', config);
      throw e;
    }
  }

  async findObject(config: MongoDbDataSourceConfig, id: string) {
    const collection = await this.clientCollection(config);
    const cursor = await collection.findOne(this.buildIdFilter(config, id),{});
    return cursor;
  }

  async clientCollection(config: MongoDbDataSourceConfig) {
    // Lazily init client on first request:
    if (!this.client) {
      await this.init();
    }

    // Using '!' here because above we ensure it exists with `init()`.
    const client = this.client!;

    if (!config.collection) {
      throw new Error("No collection configured for " + this.constructor.name);
    }

    console.log(`[MongoDbDatasource][clientCollection] db=${this.config.name} collectionName=${config.collection}`);
    
    //FIXME: Unsure as to why we sometimes pass config around and othertimes refer to `this.config`.
    const db = client.db(this.config.name);
    const collection = db.collection(config.collection);
    return collection;
  }

  async close() {
    this.client?.close();
  }

  buildIdentity(config: MongoDbDataSourceConfig, id?: string | number) {
    const identity: MongoDbIdentity = {};

    // FIXME: do we have to uppercase and not downcase?
    // Convert all ids to uppercase strings because YELLING:
    if (id || id === 0) {
      identity.id = id.toString().toUpperCase();    
    }

    if (config?.bundle) {
      identity.bundle = config.bundle;
    }

    if (config?.area) {
      identity.area = config.area;
    }

    return identity;
  }

  buildIdFilter(config: MongoDbDataSourceConfig, id?: string) {
    const identity = this.buildIdentity(config, id);
    const filter: MongoDbIdentityFilter = {};
    if (identity.id) {
      filter["_id.id"] = identity.id;
    }
    if (identity.area) {
      filter["_id.area"] = identity.area;
    }
    if (identity.bundle) {
      filter["_id.bundle"] = identity.bundle;
    }
    return filter;
  }
}
