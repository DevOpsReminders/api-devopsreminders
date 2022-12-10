import { DeepPartial } from 'typeorm';
import BaseFactory from '@database/core/BaseFactory';
import { UserEntity } from '@entities/UserEntity';
import EntityFactory from '@database/core/FactoryInterface';
import { faker, SexType } from '@faker-js/faker';

export default class UserFactory extends BaseFactory<UserEntity> implements EntityFactory<UserEntity> {
    build(data: Partial<UserEntity>): UserEntity {
        const gender = faker.name.sex() as SexType;
        const firstName = faker.name.firstName(gender);
        const lastName = faker.name.lastName();
        const name = `${firstName} ${lastName}`;
        const email = faker.helpers.unique(faker.internet.email, [firstName, lastName]).toLowerCase();
        const avatar = faker.image.avatar();

        const partial: DeepPartial<UserEntity> = {
            name,
            email,
            avatar,
            ...data,
        };

        return UserEntity.create<UserEntity>(partial);
    }
}
