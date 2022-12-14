import { expect } from 'chai';
import { beforeEach } from 'mocha';
import typeormHelper from '@testHelpers/typeormHelper';
import { UserEntity } from '@entities/UserEntity';

describe('TypeOrmConnection', () => {
    beforeEach(async () => await typeormHelper.close());
    context('connecting to db', () => {
        it('creates a connection', async () => {
            typeormHelper.expectConnectionToBeClosed();
            await typeormHelper.connect();
            typeormHelper.expectConnectionToBeInitialized();
        });

        it('closes a connection', async () => {
            typeormHelper.expectConnectionToBeClosed();
            await typeormHelper.connect();
            typeormHelper.expectConnectionToBeInitialized();
            await typeormHelper.close();
            typeormHelper.expectConnectionToBeClosed();
        });
    });

    context('factories', () => {
        it('can create mock entities', async () => {
            await typeormHelper.connect();
            const mockUserEmail = `testUser.${Date.now()}@example.com`;
            const factories = await typeormHelper.getFactories();
            await factories.user.create({
                email: mockUserEmail,
            });
            const results = await UserEntity.findOneBy({
                email: mockUserEmail,
            });
            expect(results).to.be.an.instanceof(UserEntity);
            expect(results).to.have.property('email');
            expect(results?.email).to.eq(mockUserEmail);
        });
    });
});
