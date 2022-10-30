const MongoClient = require("mongodb").MongoClient;

let client = null;

module.exports = clientConnect = async (uri) => {
  if (!uri) {
    return Promise.reject("No Url Provided for MongoDbDatasource Connection");
  }

  // As of v4.x.x, MongoDb does not expose `isConnected()` method or property.
  // Reconnecting is handled internally to the Mongo driver, so we just check
  // to see if the client is instantiated:
  let isConnected =  Boolean(client);

  if (isConnected) {
    return Promise.resolve(client);
  }

  return new Promise((resolve, reject) => {
    MongoClient.connect(uri, { useUnifiedTopology: true }, (err, _client) => {
      if (err) {
        client = null;
        reject(err);
      }
      client = _client;
      resolve(client);
    });
  });
};
