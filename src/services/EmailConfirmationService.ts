import { UserEntity } from '@entities/UserEntity';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import MailerService, { TemplateMailResponse } from '@services/MailService';
import appConfig from '@config/index';
import jwt from 'jsonwebtoken';

export default class EmailConfirmationService {
    static from = 'devopsreminders@gmail.com';
    static subject = 'DevOpsReminders email confirmation';
    static emailTemplate: EmailTemplateName = 'emailConfirmation';

    static async verifyEmail(confirmationCode: string) {
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

    static async sendEmail(user: UserEntity): Promise<TemplateMailResponse> {
        const mailer = new MailerService(appConfig.email);
        const replacements = {
            name: user.name,
            baseUrl: appConfig.server.baseUrl.replace(/\/$/, ''),
            confirmationCode: this.createConfirmationCode(user),
        };
        return await mailer.sendTemplateMail(
            {
                to: user.email,
                from: this.from,
                subject: this.subject,
            },
            this.emailTemplate,
            replacements,
        );
    }

    protected static createConfirmationCode(user: UserEntity) {
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
