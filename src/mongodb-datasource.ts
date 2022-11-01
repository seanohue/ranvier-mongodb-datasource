import { MongoClient } from "mongodb";
import clientConnect from "./client-connect";
import validateDatasourceConfig from "./config-validation";
import { MongoDbDataSourceConfig, MongoDbIdentity } from "./types";

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

  async replaceCollection(config: MongoDbDataSourceConfig, data) {
    const collection = await this.clientCollection(config);
        // build filter without id, to capture other stuff in same
        // bundle/area only...
    const cursor = collection.deleteMany(this.buildIdFilter(config))
      .finally(() => {
        data.forEach((v) => (v._id = this.buildIdentity(config, v.id)));
        collection.insertMany(data, {});
      });
    return cursor;
  }

  async replaceObject(
    config: MongoDbDataSourceConfig, 
    id: string, 
    data
  ) {
    const collection = await this.clientCollection(this.client, config);
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

  async findCollection(config) {
    try {
      const collection = this.clientCollection(config);
      const cursor = collection.find(this.buildIdFilter(config));
      return cursor.toArray();
    } catch (e) {
      console.warn('findCollection failed for config', config);
      throw e;
    }
  }

  findObject(config, id, callback) {
    this.client.catch(callback).then((client) => {
      this.clientCollection(client, config).findOne(
        this.buildIdFilter(config, id),
        {},
        callback
      );
    });
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

    console.log(`[MongoDbDatasource][clientCollection] dbName=${this.config.name} collectionName=${config.collection}`);
    
    //FIXME: Unsure as to why we sometimes pass config around and othertimes refer to `this.config`.
    const db = client.db(this.config.name);
    const collection = db.collection(config.collection);
    return collection;
  }

  close() {
    this.client
      .catch((err) => {
        throw new Error(err);
      })
      .then((client) => {
        if (client && client.isConnected()) {
          client.close();
        }
      });
  }

  buildIdentity(config, id?: string | number) {
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
    const filter = {};
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
