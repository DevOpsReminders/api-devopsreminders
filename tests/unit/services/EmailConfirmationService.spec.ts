import EmailConfirmationService, { EmailConfirmationServiceOptions } from '@services/EmailConfirmationService';
import sinon from 'sinon';
import stubs from '@testHelpers/stubs';
import typeormHelper from '@testHelpers/typeormHelper';
import MailerAssertions from '@testHelpers/MailerAssertions';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import appConfig from '@config/index';
import { SendMailOptions } from 'nodemailer';
import { expect } from 'chai';
import { UserEntity } from '@entities/UserEntity';

describe('EmailConfirmationService', async function () {
    const sandbox = sinon.createSandbox();

    before(async () => {
        await typeormHelper.connect();
    });
    after(async () => {
        await typeormHelper.close();
        sandbox.restore();
    });
    const emailTemplate: EmailTemplateName = 'emailConfirmation';
    const mailer = stubs.mailerService(sandbox);
    const serviceOptions: EmailConfirmationServiceOptions = {
        from: 'email@example.com',
        subject: 'email confirmation',
        emailTemplate,
        mailer,
    };
    const factories = await typeormHelper.getFactories();

    context('EmailConfirmationService::sendEmail', () => {
        it('sends a confirmation email to the user', async () => {
            const user = await factories.user.create({
                emailConfirmed: false,
            });

            const expectedConfirmationCode = 'a-confirmation-code';
            const expectedMailParams: SendMailOptions = {
                from: serviceOptions.from,
                subject: serviceOptions.subject,
                to: user.email,
            };
            const expectedReplacements = {
                name: user.name,
                baseUrl: appConfig.server.baseUrl.replace(/\/$/, ''),
                confirmationCode: expectedConfirmationCode,
            };
            const service = new EmailConfirmationService(serviceOptions);
            sandbox.stub(service, 'createConfirmationCode').returns(expectedConfirmationCode);
            const response = await service.sendEmail(user);

            await MailerAssertions.expectEmailTemplateToHaveBeenSent(
                emailTemplate,
                expectedReplacements,
                expectedMailParams,
                response,
            );
        });
    });

    context('EmailConfirmationService::verifyEmail', () => {
        afterEach(() => sandbox.restore());

        it('returns false when the confirmation code is malformed', async () => {
            const UserFindSpy = sandbox.spy(UserEntity, 'findOneBy');
            const service = new EmailConfirmationService(serviceOptions);
            const result = await service.verifyEmail('a-bad-code');
            expect(UserFindSpy.calledOnce, 'user find was called').to.be.false;
            expect(result, 'result is false').to.be.false;
        });
        it('returns false when the user does not exist', async () => {
            const service = new EmailConfirmationService(serviceOptions);

            const confirmationCode = service.createConfirmationCode(
                factories.user.build({
                    id: 100,
                }),
            );
            const UserFindSpy = sandbox.spy(UserEntity, 'findOneBy');

            const result = await service.verifyEmail(confirmationCode);
            expect(result).to.be.false;
            expect(UserFindSpy.called, 'user find was called').to.be.true;
        });

        it('returns false when the user email is already confirmed', async () => {
            const user = await factories.user.create({
                emailConfirmed: true,
            });
            const service = new EmailConfirmationService(serviceOptions);

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
            const service = new EmailConfirmationService(serviceOptions);

            const confirmationCode = service.createConfirmationCode(user);
            const result = await service.verifyEmail(confirmationCode);
            expect(result).to.be.true;
        });
    });
});
