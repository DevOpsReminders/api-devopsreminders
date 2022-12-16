import appConfig from '@config/index';
import MailTemplateService from '@services/MailTemplateService';
import { expect } from 'chai';
import fixtures from '@testHelpers/fixtures';
import { EmailTemplateName } from '@config/modules/emailsConfig';

describe('MailTemplateService', function () {
    const mailTemplateService = new MailTemplateService(appConfig.email);
    const name = 'John Doe';
    const email = 'email@examaple.com';
    const fakeMailTemplate = async (fileName: string, replacements: Record<string, string>): Promise<string> => {
        const tpl = await fixtures.getEmailTemplate('sample.txt');
        Object.keys(replacements).forEach(replacementKey => {
            tpl.replace(`<%= ${replacementKey} %>`, replacements[replacementKey]);
        });

        return tpl;
    };
    context('MailTemplateService::templatesWithReplacements', () => {
        it('generates text email templates', async () => {
            const { text } = await mailTemplateService.templatesWithReplacements('sample', { name, email });
            const expected = await fakeMailTemplate('sample.txt', { name, email });
            expect(text).not.to.be.undefined.and.to.equal(expected);
        });

        it('generates html email templates', async () => {
            const { html } = await mailTemplateService.templatesWithReplacements('sample', { name, email });
            const expected = await fakeMailTemplate('sample.html', { name, email });
            expect(html).not.to.be.undefined.and.to.equal(expected);
        });

        it('returns undefined for missing templates', async () => {
            const { html, text } = await mailTemplateService.templatesWithReplacements(
                'no-exist' as EmailTemplateName,
                { name, email },
            );
            expect(html).to.be.undefined;
            expect(text).to.be.undefined;
        });
    });
});
