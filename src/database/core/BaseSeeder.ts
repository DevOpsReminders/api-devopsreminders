import SeederInterface from '@database/core/SeederInterface';
import { EntityManager } from 'typeorm';

export default abstract class BaseSeeder implements SeederInterface {
    entityManager: EntityManager;

    protected constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    run(): Promise<unknown> {
        return Promise.resolve(undefined);
    }
}
