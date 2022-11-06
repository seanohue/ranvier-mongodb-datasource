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
;
const mongodb_datasource_1 = __importDefault(require("./mongodb-datasource"));
// FIXME: May need to add some methods "lost" from the array datasource class. Those can be moved to base.
// FIXME: 2022-11-02T21:50:58.384Z - error: fetch not supported by MongoDbObject
class MongoDbObjectDataSource extends mongodb_datasource_1.default {
    /**
     * Returns all entries for a given config.
     */
    fetchAll(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.findCollection(config);
            /* Data should output as a dictionary, convert from array. */
            return results === null || results === void 0 ? void 0 : results.reduce((output, result) => {
                const key = result.id || result._id.id;
                console.log({ key, result });
                if (!key && key !== 0) {
                    throw new Error(`Invalid key for datasource fetchAll result, got ${key}: ` + JSON.stringify(result));
                }
                output[key] = result;
                return output;
            }, {});
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
     * Returns if the collection has data
     */
    hasData(config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.findCollection(config);
            return Boolean(collection.length);
        });
    }
    /**
     * Gets a specific record by id for a given config
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
            /* Data should come in as a dictionary, convert to array. */
            const dataArray = Array.from(Object.values(data));
            return this.replaceCollection(config, dataArray);
        });
    }
}
exports.default = MongoDbObjectDataSource;
//# sourceMappingURL=mongodb-object-datasource.js.map