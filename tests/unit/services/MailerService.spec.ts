import appConfig from '@config/index';
import MailerService, { MailResponse, TemplateMailResponse } from '@services/MailService';
import sinon from 'sinon';
import nodemailer, { SendMailOptions } from 'nodemailer';
import stubTransport from 'nodemailer-stub-transport';
import { expect } from 'chai';
import { isArray, isString } from 'lodash';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import fakeMailTemplatetor from '@testHelpers/fakeMailTemplatetor';

describe('MailerService', function () {
    const sandbox = sinon.createSandbox();

    after(function () {
        sandbox.restore();
    });
    const stubMailer = nodemailer.createTransport(stubTransport());
    const mailerService = new MailerService(appConfig.email);
    sandbox.stub(mailerService, 'getTransport').returns(stubMailer);
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

    const expectEmailToHaveBeenSent = ({ from, to }: SendMailOptions, { envelope, messageId }: MailResponse): void => {
        const toArray: string[] = isArray(to) ? (to as string[]) : isString(to) ? [String(to)] : [];
        expect(messageId).to.be.a('string');
        expect(envelope.from).to.equal(from);
        expect(envelope.to).to.deep.equal(toArray);
    };

    const expectEmailTemplateToHaveBeenSent = async (
        templateName: EmailTemplateName,
        replacements: Record<string, string>,
        mailParams: SendMailOptions,
        { response, html, text }: TemplateMailResponse,
    ): Promise<void> => {
        expectEmailToHaveBeenSent(mailParams, response);
        const expectedHtml = await fakeMailTemplatetor(`${templateName}.html`, replacements);
        const expectedText = await fakeMailTemplatetor(`${templateName}.txt`, replacements);
        expect(expectedHtml).to.be.equal(html);
        expect(expectedText).to.be.equal(text);
    };
    context('MailerService::sendMail', () => {
        context('when params are valid', () => {
            it('sends an email', async () => {
                const response = await mailerService.sendMail(mailParams);
                expectEmailToHaveBeenSent(mailParams, response);
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
                await expectEmailTemplateToHaveBeenSent(templateName, replacements, mailParams, response);
            });
        });
    });
});
