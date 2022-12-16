import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { EmailConfig, EmailTemplateName } from '@config/modules/emailsConfig';
import MailTemplateService from '@services/MailTemplateService';

export type MailResponse = {
    messageId: string;
    response: Buffer;
    envelope: {
        from: string;
        to: string[];
    };
};
export type TemplateMailResponse = {
    response: MailResponse;
    html: string | undefined;
    text: string | undefined;
};
export default class MailerService {
    config: EmailConfig;
    transporter?: Transporter;
    templateService: MailTemplateService;

    constructor(config: EmailConfig) {
        this.config = config;
        this.templateService = new MailTemplateService(config);
    }

    public getTransport() {
        if (!this.transporter) {
            this.transporter = this.createTransport();
        }

        return this.transporter;
    }

    protected createTransport(): Transporter {
        return nodemailer.createTransport({
            url: this.config.transportUri,
        });
    }

    sendMail(mailParams: SendMailOptions): Promise<MailResponse> {
        return this.getTransport().sendMail(mailParams);
    }

    async sendTemplateMail(
        mailParams: SendMailOptions,
        templateName: EmailTemplateName,
        replacements: Record<string, string | number | Date>,
    ): Promise<TemplateMailResponse> {
        const { html, text } = await this.templateService.templatesWithReplacements(templateName, replacements);
        const response = await this.sendMail({
            ...mailParams,
            html,
            text,
        });

        return { response, html, text };
    }
}
