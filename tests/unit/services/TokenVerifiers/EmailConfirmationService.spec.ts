import EmailConfirmationService from '@services/TokenVerifiers/EmailConfirmationService';
import { UserEntity } from '@entities/UserEntity';
import { expect } from 'chai';
import sinon from 'sinon';
import stubs from '@testHelpers/stubs';
import typeormHelper from '@testHelpers/typeormHelper';

describe('EmailConfirmationService', async function () {
    const sandbox = sinon.createSandbox();
    const service = new EmailConfirmationService({ mailer: stubs.mailerService(sandbox) });
    const factories = await typeormHelper.getFactories();

    before(async () => {
        await typeormHelper.connect();
    });
    after(async () => {
        await typeormHelper.close();
        sandbox.restore();
    });

    describe('EmailConfirmationService::callbacks', () => {
        context(`when data is valid`, () => {
            it('returns false when the user email is already confirmed', async () => {
                const user = await factories.user.create({
                    emailConfirmed: true,
                });

                const confirmationCode = service.createConfirmationCode(user);
                const UserFindSpy = sandbox.spy(UserEntity, 'findOneBy');

                const result = await service.verifyEmail(confirmationCode);
                expect(result).to.be.false;
                expect(UserFindSpy.called, 'user find was called').to.be.true;
            });

            it('returns true and updates the user', async () => {
                const user = await factories.user.create({
                    emailConfirmed: false,
                });
                const confirmationCode = service.createConfirmationCode(user);
                const result = await service.verifyEmail(confirmationCode);
                expect(result).to.be.true;
            });
        });
    });
});
