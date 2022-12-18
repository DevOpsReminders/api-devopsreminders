import { UserEntity } from '@entities/UserEntity';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import BaseTokenVerifier, { BaseTokenVerifierOptions } from '@services/TokenVerifiers/BaseTokenVerifier';
import MailerService from '@services/MailService';

export default class EmailConfirmationService extends BaseTokenVerifier {
    static instance?: EmailConfirmationService;

    emailTemplateDefault: EmailTemplateName = 'emailConfirmation';
    subjectDefault = 'DevOpsReminders email confirmation';

    replacer = (user: UserEntity): Record<string, string> => ({
        name: user.name,
        baseUrl: this.getBaseUrl(),
        confirmationCode: this.createConfirmationCode(user),
    });

    verifyCallback = async (user: UserEntity): Promise<boolean> => {
        user.emailConfirmed = true;
        await user.save();
        return true;
    };

    static getInstance(config?: BaseTokenVerifierOptions): BaseTokenVerifier {
        if (!this.instance || !!config) {
            this.instance = new EmailConfirmationService(config || { mailer: MailerService.getInstance() });
        }

        return this.instance;
    }
}
