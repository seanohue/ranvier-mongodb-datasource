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
}
export declare type MongoDbIdentityFilter = {
    [Key in `_id.${keyof MongoDbIdentity}`]?: MongoDbIdentity[keyof MongoDbIdentity];
};
