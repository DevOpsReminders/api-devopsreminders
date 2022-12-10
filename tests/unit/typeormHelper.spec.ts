import { expect } from 'chai';
import { beforeEach } from 'mocha';
import typeormHelper from '@testHelpers/typeormHelper';
import { UserEntity } from '@entities/UserEntity';

describe('TypeOrmConnection', () => {
    beforeEach(async () => await typeormHelper.close());
    context('connecting to db', () => {
        it('creates a connection', async () => {
            expect(typeormHelper.datasource.isInitialized).to.be.false;
            await typeormHelper.connect();
            expect(typeormHelper.datasource.isInitialized).to.be.true;
        });

        it('closes a connection', async () => {
            expect(typeormHelper.datasource.isInitialized).to.be.false;
            await typeormHelper.connect();
            expect(typeormHelper.datasource.isInitialized).to.be.true;
            await typeormHelper.close();
            expect(typeormHelper.datasource.isInitialized).to.be.false;
        });
    });

    context('factories', () => {
        it('can create mock entities', async () => {
            await typeormHelper.connect();
            const mockUserEmail = `testUser.${Date.now()}@example.com`;
            await typeormHelper.factories.user.create({
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
