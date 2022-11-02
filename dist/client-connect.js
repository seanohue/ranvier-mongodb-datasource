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
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
// Keep track of Mongo client as a singleton.
let client = null;
function clientConnect(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!uri) {
            return Promise.reject("No Url Provided for MongoDbDatasource Connection");
        }
        // As of v4.x.x, MongoDb does not expose `isConnected()` method or property.
        // Reconnecting is handled internally to the Mongo driver, so we just check
        // to see if the client is instantiated:
        if (client) {
            return client;
        }
        return mongodb_1.MongoClient.connect(uri);
    });
}
exports.default = clientConnect;
;
//# sourceMappingURL=client-connect.js.map