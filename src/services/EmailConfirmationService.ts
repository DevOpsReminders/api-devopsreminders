import { UserEntity } from '@entities/UserEntity';
import { EmailConfig, EmailTemplateName } from '@config/modules/emailsConfig';
import MailerService, { TemplateMailResponse } from '@services/MailService';
import appConfig from '@config/index';
import jwt from 'jsonwebtoken';
import { Address } from 'nodemailer/lib/mailer';

type ClassOptions = {
    from?: Address | string;
    subject?: string;
    emailTemplate?: EmailTemplateName;
    mailer?: MailerService;
    emailConfig?: EmailConfig;
};
type ClassOptionsWithMailer = ClassOptions & { mailer: MailerService; emailConfig?: undefined };
type ClassOptionsWithEmailConfig = ClassOptions & { emailConfig: EmailConfig; mailer?: undefined };

export type EmailConfirmationServiceOptions = ClassOptionsWithMailer | ClassOptionsWithEmailConfig;

export default class EmailConfirmationService {
    static instance?: EmailConfirmationService;
    mailer: MailerService;
    from: Address | string;
    subject: string;
    emailTemplate: EmailTemplateName;

    fromDefault = 'devopsreminders@gmail.com';
    subjectDefault = 'DevOpsReminders email confirmation';
    emailTemplateDefault: EmailTemplateName = 'emailConfirmation';

    static getInstance(config?: EmailConfirmationServiceOptions): EmailConfirmationService {
        if (!this.instance || !!config) {
            this.instance = new EmailConfirmationService(config || { mailer: MailerService.getInstance() });
        }

        return this.instance;
    }

    constructor(options: EmailConfirmationServiceOptions) {
        const { from, subject, emailTemplate, emailConfig, mailer } = options;
        if (!mailer && !emailConfig) {
            throw new Error(`EmailConfirmationService requires a "mailer" or "emailConfig"`);
        }
        this.from = from || this.fromDefault;
        this.subject = subject || this.subjectDefault;
        this.emailTemplate = emailTemplate || this.emailTemplateDefault;
        this.mailer = mailer || new MailerService(emailConfig);
    }

    async sendEmail(user: UserEntity): Promise<TemplateMailResponse> {
        const replacements = {
            name: user.name,
            baseUrl: appConfig.server.baseUrl.replace(/\/$/, ''),
            confirmationCode: this.createConfirmationCode(user),
        };

        return await this.mailer.sendTemplateMail(
            {
                to: user.email,
                from: this.from,
                subject: this.subject,
            },
            this.emailTemplate,
            replacements,
        );
    }

    async verifyEmail(confirmationCode: string) {
        try {
            const { id, email } = jwt.decode(confirmationCode) as { id: string | undefined; email: string | undefined };
            if (!id || !email) return false;
            const user = await UserEntity.findOneBy({ id: Number(id), email, emailConfirmed: false });
            if (!user) return false;
            jwt.verify(confirmationCode, appConfig.auth.jwtSecret + email);
            user.emailConfirmed = true;
            await user.save();
            return true;
        } catch (error) {
            return false;
        }
    }

    createConfirmationCode(user: UserEntity) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            appConfig.auth.jwtSecret + user.email,
            {
                issuer: appConfig.server.hostname,
                expiresIn: '6 hours',
            },
        );
    }
}
