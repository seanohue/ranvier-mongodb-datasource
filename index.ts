import MongoDbDatasource from "./src/mongodb-datasource";
import MongoDbArrayDatasource from "./src/mongodb-array-datasource";
import MongoDbObjectDatasource from "./src/mongodb-object-datasource";
import clientConnect from "./src/client-connect";

module.exports = {
  clientConnect,
  MongoDbDatasource,
  MongoDbArrayDatasource,
  MongoDbObjectDatasource,
};
