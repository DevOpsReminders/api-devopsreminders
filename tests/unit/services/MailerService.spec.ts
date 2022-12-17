import sinon from 'sinon';
import { SendMailOptions } from 'nodemailer';
import { expect } from 'chai';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import stubs from '@testHelpers/stubs';
import MailerAssertions from '@testHelpers/MailerAssertions';

describe('MailerService', function () {
    const sandbox = sinon.createSandbox();

    after(function () {
        sandbox.restore();
    });
    const mailerService = stubs.mailerService(sandbox);
    const mailParams: SendMailOptions = {
        from: 'john@example.com',
        to: 'jane@example.org',
        subject: 'testing the mail service',
        text: 'is it working?',
    };
    const templateName: EmailTemplateName = 'sample';
    const replacements = {
        name: 'Jane Doe',
        email: 'jane@example.org',
    };

    context('MailerService::sendMail', () => {
        context('when params are valid', () => {
            it('sends an email', async () => {
                const response = await mailerService.sendMail(mailParams);
                MailerAssertions.expectEmailToHaveBeenSent(mailParams, response);
            });
        });
        context('when params are invalid', () => {
            it('throws an exception', async () => {
                const params = {
                    ...mailParams,
                    to: 'notanemail',
                };
                expect(() => mailerService.sendMail(params)).to.throw;
            });
        });
    });

    context('MailerService::sendTemplateMail', () => {
        context('when params are valid', () => {
            it('sends an email template', async () => {
                const response = await mailerService.sendTemplateMail(mailParams, templateName, replacements);
                await MailerAssertions.expectEmailTemplateToHaveBeenSent(
                    templateName,
                    replacements,
                    mailParams,
                    response,
                );
            });
        });
    });
});
