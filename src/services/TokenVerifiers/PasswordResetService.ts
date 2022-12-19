import { UserEntity } from '@entities/UserEntity';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import BaseTokenVerifier, { BaseTokenVerifierOptions } from '@services/TokenVerifiers/BaseTokenVerifier';
import Env from '@utils/Env';
import MailerService from '@services/MailService';
import generator from 'generate-password';

export default class PasswordResetService extends BaseTokenVerifier {
    static instance?: PasswordResetService;

    emailTemplate: EmailTemplateName = 'resetPasswordConfirmation';
    subject = 'DevOpsReminders reset password confirmation';

    replacer = (user: UserEntity): Record<string, string> => ({
        name: user.name,
        baseUrl: Env.getBaseUrl(),
        confirmationCode: this.createConfirmationCode(user),
    });

    verifyCallback = async (user: UserEntity): Promise<boolean> => {
        const newPassword = generator.generate({
            length: 16,
            numbers: true,
            lowercase: true,
            uppercase: true,
            symbols: true,
            excludeSimilarCharacters: true,
        });
        const emailSent = await this.emailNewPassword(user, newPassword);
        if (!emailSent) return false;
        user.password = newPassword;
        user.encryptPassword();
        await user.save();

        return true;
    };

    async emailNewPassword(user: UserEntity, password: string): Promise<boolean> {
        const replacements = {
            name: user.name,
            newPassword: password,
        };

        const emailResponse = await this.mailer.sendTemplateMail(
            {
                to: user.email,
                from: this.from,
                subject: 'DevOpsReminders password reset',
            },
            'resetPassword',
            replacements,
        );

        return !!emailResponse.response.messageId;
    }
    static getInstance(config?: BaseTokenVerifierOptions): PasswordResetService {
        if (!this.instance || !!config) {
            this.instance = new PasswordResetService(config || { mailer: MailerService.getInstance() });
        }

        return this.instance;
    }
}
