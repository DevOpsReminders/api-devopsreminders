import { SaveOptions } from 'typeorm/repository/SaveOptions';
import AppBaseEntity from '@database/core/AppBaseEntity';

type EntityFactory<Entity extends AppBaseEntity> = {
    build: (data: Partial<Entity>) => Entity;
    buildMany: (count: number, data: Partial<Entity>) => Entity[];
    create: (data: Partial<Entity>, options?: SaveOptions) => Promise<Entity>;
    createMany: (count: number, data: Partial<Entity>, options?: SaveOptions) => Promise<Entity[]>;
};
export default EntityFactory;
