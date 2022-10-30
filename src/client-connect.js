const MongoClient = require("mongodb").MongoClient;

let client = null;

module.exports = clientConnect = async (uri) => {
  if (!uri) {
    return Promise.reject("No Url Provided for MongoDbDatasource Connection");
  }
  let isConnected = false;
  try {
    isConnected = client && client.isConnected();
  } catch (e) {
    console.error(e);
    console.log({ client });
  }

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
