import nodemailer from 'nodemailer';
import stubTransport from 'nodemailer-stub-transport';
import MailerService from '@services/MailService';
import appConfig from '@config/index';
import { SinonSandbox } from 'sinon';

const stubs = {
    mailerService: (sandbox: SinonSandbox) => {
        const stubMailer = nodemailer.createTransport(stubTransport());
        const mailerService = new MailerService(appConfig.email);
        sandbox.stub(mailerService, 'getTransport').returns(stubMailer);
        return mailerService;
    },
};
export default stubs;
