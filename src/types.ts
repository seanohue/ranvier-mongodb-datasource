// FIXME: The library uses `config` to mean both datasource config and a kind of id filter config.
export interface MongoDbDataSourceConfig {
  collection: any;
  host: string;
  name: string;
  user: string;
  pass: string;
  bundle?: string;
  area?: string;
}

export interface MongoDbIdentity {
  id?: string | number;
  bundle?: string;
  area?: string;
};

export type MongoDbIdentityFilter = {
  [Key in `_id.${keyof MongoDbIdentity}`]?: MongoDbIdentity[keyof MongoDbIdentity];
}
