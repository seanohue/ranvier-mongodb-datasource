export interface MongoDbDataSourceConfig {
  collection: any;
  host: string;
  name: string;
  user: string;
  pass: string;
}

export interface MongoDbIdentity {
  id?: string | number;
  bundle?: string;
  area?: string;
};