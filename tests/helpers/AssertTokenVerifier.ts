import BaseTokenVerifier from '@services/TokenVerifiers/BaseTokenVerifier';
import sinon from 'sinon';
import typeormHelper from '@testHelpers/typeormHelper';
import { SendMailOptions } from 'nodemailer';
import MailerAssertions from '@testHelpers/MailerAssertions';
import { UserEntity } from '@entities/UserEntity';
import { expect } from 'chai';
import { ClassConstructor } from 'class-transformer';
import stubs from '@testHelpers/stubs';
import Env from '@utils/Env';

export class AssertTokenVerifier {
    serviceClass: ClassConstructor<BaseTokenVerifier>;
    name: string;

    public static async assert(service: ClassConstructor<BaseTokenVerifier>): Promise<void> {
        const tokenVerifier = new this(service);
        await tokenVerifier.runAssertions();
    }
    constructor(service: ClassConstructor<BaseTokenVerifier>) {
        this.serviceClass = service;
        this.name = service.name;
    }

    runAssertions() {
        const parent = () => this;
        context(`${parent().name} Base methods`, async function () {
            const sandbox = sinon.createSandbox();
            const serviceClass = parent().serviceClass;
            const service = new serviceClass({ mailer: stubs.mailerService(sandbox) });
            const factories = await typeormHelper.getFactories();

            before(async () => {
                await typeormHelper.connect();
            });
            after(async () => {
                await typeormHelper.close();
                sandbox.restore();
            });

            context(`${parent().name}::sendEmail`, () => {
                it(`sends a ${service.emailTemplate} email to the user`, async () => {
                    const user = await factories.user.create({
                        emailConfirmed: false,
                    });

                    const expectedConfirmationCode = 'a-confirmation-code';
                    sandbox.stub(service, 'createConfirmationCode').returns(expectedConfirmationCode);
                    const expectedMailParams: SendMailOptions = {
                        from: service.from,
                        subject: service.subject,
                        to: user.email,
                    };
                    const expectedReplacements = {
                        name: user.name,
                        baseUrl: Env.getBaseUrl(),
                        confirmationCode: expectedConfirmationCode,
                    };

                    const response = await service.sendEmail(user);

                    await MailerAssertions.expectEmailTemplateToHaveBeenSent(
                        service.emailTemplate,
                        expectedReplacements,
                        expectedMailParams,
                        response,
                    );
                });
            });

            context(`${parent().name}::verifyEmail`, () => {
                afterEach(() => sandbox.restore());

                it('returns false when the confirmation code is malformed', async () => {
                    const UserFindSpy = sandbox.spy(UserEntity, 'findOneBy');
                    const result = await service.verifyEmail('a-bad-code');
                    expect(UserFindSpy.calledOnce, 'user find was called').to.be.false;
                    expect(result, 'result is false').to.be.false;
                });

                it('returns false when the user does not exist', async () => {
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
            });
        });
    }
}
