import PasswordResetService from '@services/TokenVerifiers/PasswordResetService';
import { expect } from 'chai';
import sinon from 'sinon';
import stubs from '@testHelpers/stubs';
import typeormHelper from '@testHelpers/typeormHelper';
import bcrypt from 'bcrypt';
import { UserEntity } from '@entities/UserEntity';

describe('PasswordResetService', async function () {
    const sandbox = sinon.createSandbox();
    const factories = await typeormHelper.getFactories();

    before(async () => {
        await typeormHelper.connect();
    });
    after(async () => {
        await typeormHelper.close();
        sandbox.restore();
    });

    describe('PasswordResetService::verifyCallback', () => {
        context(`when data is valid`, () => {
            it('resets the user password', async () => {
                const user = factories.user.build({
                    emailConfirmed: true,
                });
                const oldPassword = user.password;
                user.encryptPassword();
                await user.save();
                expect(await bcrypt.compare(oldPassword, user.password), 'Old password does not match').to.be.true;
                const service = new PasswordResetService({ mailer: stubs.mailerService(sandbox) });
                const confirmationCode = service.createConfirmationCode(user);
                const result = await service.verifyEmail(confirmationCode);
                expect(result, 'Verification failed').to.be.true;
                const userAfter = await UserEntity.findOneByOrFail({ id: user.id });
                expect(await bcrypt.compare(oldPassword, userAfter.password), 'Password was not reset').to.be.false;
            });
        });
    });
});
