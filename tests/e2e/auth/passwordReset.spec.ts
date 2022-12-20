import supertest from 'supertest';
import server from '@server/index';
import { expect } from 'chai';
import typeormHelper from '@testHelpers/typeormHelper';

describe('e2e:PasswordReset', async function () {
    before(async () => await typeormHelper.connect());
    after(async () => await typeormHelper.close());
    const factories = await typeormHelper.getFactories();
    const expectedResponseBody = {
        status: 200,
        body: {
            status: 'passwordReset',
            message: 'password reset email sent',
        },
    };
    const uri = '/email/request/password-reset';
    describe(`POST ${uri}`, () => {
        context('when the email does not exist', () => {
            it('returns a 200 and does not send an email', async function () {
                const email = factories.user.build({}).email;
                const { status, body } = await supertest(server).post(uri).send({ email });
                expect(status).to.equal(200);
                expect(body).to.be.deep.equal(expectedResponseBody);
            });
        });
    });
});
