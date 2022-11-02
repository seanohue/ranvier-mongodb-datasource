import { MongoClient } from 'mongodb';
export default function clientConnect(uri: string): Promise<MongoClient>;
