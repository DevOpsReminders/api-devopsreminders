import { SendMailOptions } from 'nodemailer';
import { MailResponse, TemplateMailResponse } from '@services/MailService';
import { isArray, isString } from 'lodash';
import { expect } from 'chai';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import fakeMailTemplatetor from '@testHelpers/fakeMailTemplatetor';

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

const MailerAssertions = { expectEmailToHaveBeenSent, expectEmailTemplateToHaveBeenSent };
export default MailerAssertions;
