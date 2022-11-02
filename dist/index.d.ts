import MongoDbDatasource from "./mongodb-datasource";
import MongoDbArrayDatasource from "./mongodb-array-datasource";
import MongoDbObjectDatasource from "./mongodb-object-datasource";
import clientConnect from "./client-connect";
declare const _default: {
    clientConnect: typeof clientConnect;
    MongoDbDatasource: typeof MongoDbDatasource;
    MongoDbArrayDatasource: typeof MongoDbArrayDatasource;
    MongoDbObjectDatasource: typeof MongoDbObjectDatasource;
};
export default _default;
