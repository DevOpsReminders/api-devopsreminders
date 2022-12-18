import { UserEntity } from '@entities/UserEntity';
import { EmailConfig, EmailTemplateName } from '@config/modules/emailsConfig';
import MailerService, { TemplateMailResponse } from '@services/MailService';
import appConfig from '@config/index';
import jwt from 'jsonwebtoken';
import { Address } from 'nodemailer/lib/mailer';

type ClassOptionsWithMailer = { mailer: MailerService; emailConfig?: undefined };
type ClassOptionsWithEmailConfig = { emailConfig: EmailConfig; mailer?: undefined };
type Replacer = (user: UserEntity) => Record<string, string> | Promise<Record<string, string>>;
type VerifyCallback = (user: UserEntity) => boolean | Promise<boolean>;
export type BaseTokenVerifierOptions = ClassOptionsWithMailer | ClassOptionsWithEmailConfig;

export default abstract class BaseTokenVerifier {
    mailer: MailerService;
    from: Address | string = 'devopsreminders@gmail.com';

    abstract subject: string;
    abstract emailTemplate: EmailTemplateName;
    abstract replacer: Replacer;
    abstract verifyCallback: VerifyCallback;

    constructor(options: BaseTokenVerifierOptions) {
        const { emailConfig, mailer } = options;
        if (!mailer && !emailConfig) {
            throw new Error(`${this.constructor.name} requires a "mailer" or "emailConfig"`);
        }
        this.mailer = mailer || new MailerService(emailConfig);
    }

    async sendEmail(user: UserEntity): Promise<TemplateMailResponse> {
        const replacements = await this.replacer(user);

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

            return await this.verifyCallback(user);
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
