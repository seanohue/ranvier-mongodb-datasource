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
const mongodb_datasource_1 = __importDefault(require("./mongodb-datasource"));
class MongoDbArrayDataSource extends mongodb_datasource_1.default {
    /**
     * The constructor of the DataSource takes two parameters:
     *   config: the value of 'config' from the `dataSources` configuration in
     *           ranvier.json
     *
     *   rootPath: A string representing the project root directory (the same
     *             directory that contains ranvier.json)
     */
    constructor(config = {}, rootPath) {
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
    hasData(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.findCollection(config);
            return Boolean(collection.length);
        });
    }
    /**
     * Returns all entries for a given config.
     */
    fetchAll(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findCollection(config);
        });
    }
    /**
     * Gets a specific record by id for a given config
     * @param {Object} config
     * @param {string} id
     * @return {Promise<any>}
     */
    fetch(config = {}, id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Fetching with ', config, id);
            return this.findObject(config, id);
        });
    }
    /**
     * Perform a full replace of all data for a given config. This is the write
     * version of fetchAll
     */
    replace(config = {}, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replaceCollection(config, data);
            ;
        });
    }
    /**
     * Update specific record. Write version of `fetch`
     */
    update(config = {}, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.replaceObject(config, id, data);
        });
    }
    /**
     * Delete simply overwrites with `null`
     */
    delete(config = {}, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.update(config, id, null);
        });
    }
}
exports.default = MongoDbArrayDataSource;
//# sourceMappingURL=mongodb-array-datasource.js.map