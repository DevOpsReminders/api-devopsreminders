import Env from '@utils/Env';
import path from 'path';

const ROOT_DIR = path.join(__dirname, '..', '..');
const templatesPath = path.join(ROOT_DIR, 'views', 'emailTemplates');

const templatesNames = ['sample', 'emailConfirmation'] as const;

const emailsConfig = {
    transportUri: Env.asString('EMAIL_TRANSPORT_URI'),
    templatesPath,
    templatesNames,
};

export type EmailConfig = typeof emailsConfig;
export type EmailTemplateName = typeof templatesNames[number];
export default emailsConfig;
