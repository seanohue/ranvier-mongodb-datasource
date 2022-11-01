import { MongoClient } from 'mongodb';

// Keep track of Mongo client as a singleton.
let client: MongoClient | null = null;

export default async function clientConnect(uri: string) {
  if (!uri) {
    return Promise.reject("No Url Provided for MongoDbDatasource Connection");
  }

  // As of v4.x.x, MongoDb does not expose `isConnected()` method or property.
  // Reconnecting is handled internally to the Mongo driver, so we just check
  // to see if the client is instantiated:
  if (client) {
    return client;
  }

  return MongoClient.connect(uri);
};
