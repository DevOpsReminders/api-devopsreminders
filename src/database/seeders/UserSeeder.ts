import SeederInterface from '@database/core/SeederInterface';
import BaseSeeder from '@database/core/BaseSeeder';
import { EntityManager } from 'typeorm';
import UserFactory from '@database/factories/UserFactory';

export default class UserSeeder extends BaseSeeder implements SeederInterface {
    userFactory: UserFactory;
    constructor(entityManager: EntityManager) {
        super(entityManager);
        this.userFactory = new UserFactory(entityManager);
    }

    async run(): Promise<unknown> {
        return this.userFactory.createMany(300, {});
    }
}
