import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { EntityManager } from 'typeorm';
import AppBaseEntity from '@database/core/AppBaseEntity';

export default abstract class BaseFactory<Entity extends AppBaseEntity = AppBaseEntity> {
    abstract build(data: Partial<Entity>): Entity;
    entityManager: EntityManager;

    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    buildMany(count: number, data: Partial<Entity>): Entity[] {
        const entities: Entity[] = [];
        for (let i = 0; i < count; i++) {
            entities.push(this.build(data));
        }
        return entities;
    }

    create(data: Partial<Entity>, options?: SaveOptions): Promise<Entity> {
        const entity = this.build(data);
        return this.entityManager.save(entity, options);
    }

    createMany(count: number, data: Partial<Entity>, options?: SaveOptions): Promise<Entity[]> {
        const entities = this.buildMany(count, data);

        return this.entityManager.save(entities, options);
    }
}
