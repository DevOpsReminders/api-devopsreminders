import 'reflect-metadata';
import { DataSource } from 'typeorm';
import appConfig from '@config/index';
import UserFactory from '@database/factories/UserFactory';

const datasource = new DataSource(appConfig.database);
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
