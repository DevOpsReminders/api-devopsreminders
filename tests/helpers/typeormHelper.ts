import 'reflect-metadata';
import UserFactory from '@database/factories/UserFactory';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { expect } from 'chai';
import { AppDataSource, dbConnect } from '@database/connect';
import { DataSource } from 'typeorm';

const connect = () => dbConnect();
const close = async () => (AppDataSource?.isInitialized ? AppDataSource.destroy() : false);

const getFactories = async () => {
    const ds = await dbConnect();
    return {
        user: new UserFactory(ds.manager),
    };
};

const expectDataToExistInDb = async <Entity extends ObjectLiteral>(
    obj: FindOptionsWhere<Entity>,
    entityClass: EntityTarget<Entity>,
    message = 'data does not exist in database',
) => {
    const exists = await AppDataSource?.manager.exists(entityClass, obj);
    expect(exists, message).to.be.true;
};

const expectConnectionToBeClosed = () => {
    expect(AppDataSource).to.satisfy((conn: DataSource | undefined) => {
        return typeof conn === 'undefined' || conn?.isInitialized === false;
    });
};

const expectConnectionToBeInitialized = () => {
    expect(AppDataSource).to.satisfy((conn: DataSource | undefined) => {
        return !!conn && conn.isInitialized;
    });
};

const typeormHelper = {
    AppDataSource,
    connect,
    close,
    getFactories,
    expectDataToExistInDb,
    expectConnectionToBeClosed,
    expectConnectionToBeInitialized,
};

export default typeormHelper;
