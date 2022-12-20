import { UserEntity } from '@entities/UserEntity';
import { EmailTemplateName } from '@config/modules/emailsConfig';
import BaseTokenVerifier, { BaseTokenVerifierOptions } from '@services/TokenVerifiers/BaseTokenVerifier';
import Env from '@utils/Env';
import MailerService from '@services/MailService';

export default class EmailConfirmationService extends BaseTokenVerifier {
    static instance?: EmailConfirmationService;

    emailTemplate: EmailTemplateName = 'emailConfirmation';
    subject = 'DevOpsReminders email confirmation';

    replacer = (user: UserEntity): Record<string, string> => ({
        name: user.name,
        baseUrl: Env.getBaseUrl(),
        confirmationCode: this.createConfirmationCode(user),
    });

    verifyCallback = async (user: UserEntity): Promise<boolean> => {
        if (user.emailConfirmed) return false;
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
