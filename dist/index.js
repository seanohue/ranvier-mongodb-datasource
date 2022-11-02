"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_datasource_1 = __importDefault(require("./mongodb-datasource"));
const mongodb_array_datasource_1 = __importDefault(require("./mongodb-array-datasource"));
const mongodb_object_datasource_1 = __importDefault(require("./mongodb-object-datasource"));
const client_connect_1 = __importDefault(require("./client-connect"));
exports.default = {
    clientConnect: client_connect_1.default,
    MongoDbDatasource: mongodb_datasource_1.default,
    MongoDbArrayDatasource: mongodb_array_datasource_1.default,
    MongoDbObjectDatasource: mongodb_object_datasource_1.default,
};
//# sourceMappingURL=index.js.map