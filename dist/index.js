// src/client-connect.ts
var import_mongodb = require("mongodb");
var client = null;
async function clientConnect(uri) {
  if (!uri) {
    return Promise.reject("No Url Provided for MongoDbDatasource Connection");
  }
  if (client) {
    return client;
  }
  return import_mongodb.MongoClient.connect(uri);
}

// src/config-validation.ts
var ERR_MSG = {
  NULL_DATASOURCE_CONFIG: "Null MongoDbDatasource config",
  NULL_HOST: "Invalid MongoDbDatasource config: 'host' (ip:port) is required.",
  NULL_NAME: "Invalid MongoDbDatasource config: 'name' (database name) is required.",
  NULL_USER: "Invalid MongoDbDatasource config: 'user' (user name) is required.",
  NULL_PASS: "Invalid MongoDbDatasource config: 'pass' (user password) is required."
};
function validateDatasourceConfig(config) {
  const _err = [];
  if (!config) {
    _err.push(ERR_MSG.NULL_DATASOURCE_CONFIG);
  } else {
    if (!config.host) {
      _err.push(ERR_MSG.NULL_HOST);
    }
    if (!config.name) {
      _err.push(ERR_MSG.NULL_NAME);
    }
    if (!config.user) {
      _err.push(ERR_MSG.NULL_USER);
    }
    if (!config.pass) {
      _err.push(ERR_MSG.NULL_PASS);
    }
  }
  if (_err.length > 0) {
    throw new Error(`Errors found in Datasource config: ${_err.join("; ")}`);
  }
}

// src/mongodb-datasource.ts
var MongoDbDataSource = class {
  constructor(config = {}) {
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
  async replaceCollection(config, data) {
    const collection = await this.clientCollection(config);
    const cursor = collection.deleteMany(this.buildIdFilter(config)).finally(() => {
      data.forEach((v) => v._id = this.buildIdentity(config, v.id));
      collection.insertMany(data, {});
    });
    return cursor;
  }
  async replaceObject(config, id, data) {
    const collection = await this.clientCollection(config);
    if (data) {
      data._id = this.buildIdentity(config, id);
      return collection.replaceOne(
        { _id: data._id },
        data,
        { upsert: true }
      );
    } else {
      return collection.deleteOne(this.buildIdFilter(config, id));
    }
  }
  async findCollection(config) {
    try {
      const collection = await this.clientCollection(config);
      const cursor = collection.find(this.buildIdFilter(config));
      return cursor.toArray();
    } catch (e) {
      console.warn("findCollection failed for config", config);
      throw e;
    }
  }
  async findObject(config, id) {
    const collection = await this.clientCollection(config);
    const cursor = await collection.findOne(this.buildIdFilter(config, id), {});
    return cursor;
  }
  async clientCollection(config) {
    if (!this.client) {
      await this.init();
    }
    const client2 = this.client;
    if (!config.collection) {
      throw new Error("No collection configured for " + this.constructor.name);
    }
    console.log(`[MongoDbDatasource][clientCollection] dbName=${this.config.name} collectionName=${config.collection}`);
    const db = client2.db(this.config.name);
    const collection = db.collection(config.collection);
    return collection;
  }
  async close() {
    var _a;
    (_a = this.client) == null ? void 0 : _a.close();
  }
  buildIdentity(config, id) {
    const identity = {};
    if (id || id === 0) {
      identity.id = id.toString().toUpperCase();
    }
    if (config == null ? void 0 : config.bundle) {
      identity.bundle = config.bundle;
    }
    if (config == null ? void 0 : config.area) {
      identity.area = config.area;
    }
    return identity;
  }
  buildIdFilter(config, id) {
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
};

// src/mongodb-array-datasource.ts
var MongoDbArrayDataSource = class extends MongoDbDataSource {
  constructor(config = {}, rootPath) {
    super(config);
  }
  async hasData(config = {}) {
    const collection = await this.findCollection(config);
    return Boolean(collection.length);
  }
  async fetchAll(config = {}) {
    return this.findCollection(config);
  }
  async fetch(config = {}, id) {
    console.log("Fetching with ", config, id);
    return this.findObject(config, id);
  }
  async replace(config = {}, data) {
    return this.replaceCollection(config, data);
    ;
  }
  async update(config = {}, id, data) {
    return this.replaceObject(config, id, data);
  }
  async delete(config = {}, id) {
    return this.update(config, id, null);
  }
};

// src/mongodb-object-datasource.ts
var MongoDbObjectDataSource = class extends MongoDbDataSource {
  async fetchAll(config = {}) {
    const results = await this.findCollection(config);
    return results == null ? void 0 : results.reduce((output, result) => {
      const key = result.id || result._id.id;
      if (!key && key !== 0) {
        throw new Error(`Invalid key for datasource fetchAll result, got ${key}: ` + JSON.stringify(result));
      }
      output[key] = result;
      return output;
    }, {});
  }
  async replace(config = {}, data) {
    const dataArray = Array.from(Object.values(data));
    return this.replaceCollection(config, dataArray);
  }
};

// index.ts
module.exports = {
  clientConnect,
  MongoDbDatasource: MongoDbDataSource,
  MongoDbArrayDatasource: MongoDbArrayDataSource,
  MongoDbObjectDatasource: MongoDbObjectDataSource
};
