import nodemailer from 'nodemailer';
import stubTransport from 'nodemailer-stub-transport';
import MailerService from '@services/MailService';
import appConfig from '@config/index';
import { SinonSandbox } from 'sinon';
import EmailConfirmationService from '@services/TokenVerifiers/EmailConfirmationService';

const stubs = {
    mailerService: (sandbox: SinonSandbox): MailerService => {
        const stubMailer = nodemailer.createTransport(stubTransport());
        const mailerService = new MailerService(appConfig.email);
        sandbox.stub(mailerService, 'getTransport').returns(stubMailer);
        return mailerService;
    },
    emailConfirmationService: (sandbox: SinonSandbox): EmailConfirmationService => {
        const emailConfirmationService = new EmailConfirmationService({
            mailer: stubs.mailerService(sandbox),
        });
        sandbox.stub(emailConfirmationService, 'sendEmail').resolves({
            html: undefined,
            text: undefined,
            response: {
                messageId: 'messageId',
                response: Buffer.from('ok'),
                envelope: {
                    from: 'from',
                    to: ['to'],
                },
            },
        });
        return emailConfirmationService;
    },
};
export default stubs;
