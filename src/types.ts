// FIXME: The library uses `config` to mean both datasource config and a kind of id filter config.
export interface MongoDbDataSourceConfig {
  collection: string;
  host: string;
  name: string;
  user: string;
  pass: string;
  bundle?: string;
  area?: string;
  useBundle?: boolean; // whether to filter by bundle, default undefined (false)
}

export interface MongoDbIdentity {
  id?: string | number;
  bundle?: string;
  area?: string;
};

export type MongoDbIdentityFilter = {
  [Key in `_id.${keyof MongoDbIdentity}`]?: MongoDbIdentity[keyof MongoDbIdentity];
}
