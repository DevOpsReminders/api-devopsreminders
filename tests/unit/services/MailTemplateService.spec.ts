import appConfig from '@config/index';
import MailTemplateService from '@services/MailTemplateService';
import { expect } from 'chai';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import fakeMailTemplatetor from '@testHelpers/fakeMailTemplatetor';

describe('MailTemplateService', function () {
    const mailTemplateService = new MailTemplateService(appConfig.email);
    const name = 'John Doe';
    const email = 'email@examaple.com';

    context('MailTemplateService::templatesWithReplacements', () => {
        it('generates text email templates', async () => {
            const { text } = await mailTemplateService.templatesWithReplacements('sample', { name, email });
            const expected = await fakeMailTemplatetor('sample.txt', { name, email });
            expect(text).to.equal(expected);
        });

        it('generates html email templates', async () => {
            const { html } = await mailTemplateService.templatesWithReplacements('sample', { name, email });
            const expected = await fakeMailTemplatetor('sample.html', { name, email });
            expect(html).to.equal(expected);
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
