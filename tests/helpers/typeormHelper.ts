import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import appConfig from '@config/index';
import UserFactory from '@database/factories/UserFactory';

const dbConfig: SqliteConnectionOptions = {
    ...appConfig.database,
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    logging: false,
    poolSize: undefined,
    flags: undefined,
};

const datasource = new DataSource(dbConfig);
const connect = async () => (datasource.isInitialized ? datasource : datasource.initialize());
const close = async () => (datasource.isInitialized ? datasource.destroy() : false);

const factories = {
    user: new UserFactory(datasource.manager),
};

const typeormHelper = {
    datasource,
    connect,
    close,
    factories,
};

export default typeormHelper;
