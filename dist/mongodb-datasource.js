"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_connect_1 = __importDefault(require("./client-connect"));
const config_validation_1 = __importDefault(require("./config-validation"));
class MongoDbDataSource {
    constructor(config = {}) {
        this.config = config;
        (0, config_validation_1.default)(this.config);
        this.client = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield (0, client_connect_1.default)(this.uri);
        });
    }
    get uri() {
        const user = encodeURIComponent(this.config.user);
        const password = encodeURIComponent(this.config.pass);
        const host = this.config.host;
        const authMechanism = "DEFAULT";
        const db = this.config.name;
        return `mongodb://${user}:${password}@${host}/?authMechanism=${authMechanism}&authSource=${db}`;
    }
    replaceCollection(config, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.clientCollection(config);
            // build filter without id, to capture other stuff in same
            // bundle/area only...
            const cursor = collection.deleteMany(this.buildIdFilter(config))
                .finally(() => {
                data.forEach((v) => (v._id = this.buildIdentity(config, v.id)));
                collection.insertMany(data, {});
            });
            return cursor;
        });
    }
    replaceObject(config, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.clientCollection(config);
            if (data) {
                data._id = this.buildIdentity(config, id);
                return collection.replaceOne({ _id: data._id }, data, { upsert: true });
            }
            else {
                return collection.deleteOne(this.buildIdFilter(config, id));
            }
        });
    }
    findCollection(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = yield this.clientCollection(config);
                const idFilter = this.buildIdFilter(config);
                console.warn(`Searching collection using idFilter`, idFilter);
                const cursor = collection.find(idFilter);
                return cursor.toArray();
            }
            catch (e) {
                console.warn('findCollection failed for config', config);
                throw e;
            }
        });
    }
    findObject(config, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.clientCollection(config);
            const cursor = yield collection.findOne(this.buildIdFilter(config, id), {});
            return cursor;
        });
    }
    clientCollection(config) {
        return __awaiter(this, void 0, void 0, function* () {
            // Lazily init client on first request:
            if (!this.client) {
                yield this.init();
            }
            // Using '!' here because above we ensure it exists with `init()`.
            const client = this.client;
            if (!config.collection) {
                throw new Error("No collection configured for " + this.constructor.name);
            }
            console.log(`[MongoDbDatasource][clientCollection] db=${this.config.name} collectionName=${config.collection}`);
            //FIXME: Unsure as to why we sometimes pass config around and othertimes refer to `this.config`.
            const db = client.db(this.config.name);
            const collection = db.collection(config.collection);
            return collection;
        });
    }
    close() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.client) === null || _a === void 0 ? void 0 : _a.close();
        });
    }
    buildIdentity(config, id) {
        const identity = {};
        // FIXME: do we have to uppercase and not downcase?
        // Convert all ids to uppercase strings because YELLING:
        if (id || id === 0) {
            identity.id = id.toString().toUpperCase();
        }
        if (config.useBundle && (config === null || config === void 0 ? void 0 : config.bundle)) {
            identity.bundle = config.bundle;
        }
        if (config === null || config === void 0 ? void 0 : config.area) {
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
}
exports.default = MongoDbDataSource;
//# sourceMappingURL=mongodb-datasource.js.map