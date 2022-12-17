import supertest from 'supertest';
import server from '@server/index';
import { expect } from 'chai';
import typeormHelper from '@testHelpers/typeormHelper';
import { UserEntity } from '@entities/UserEntity';
import { expectBodyToBeValidAuthResponse } from '@testHelpers/expectBodyToBeValidAuthResponse';
import { expectArrayToContainObjectWithProperties } from '@testHelpers/expectArrayToContainObjectWithProperties';

describe('log in', function () {
    before(async () => await typeormHelper.connect());
    after(async () => await typeormHelper.close());

    const uri = '/auth/email/login';
    describe(`POST ${uri}`, () => {
        context('when the credentials are valid', () => {
            it('returns user and jwt', async function () {
                this.timeout(8000);
                const factories = await typeormHelper.getFactories();
                const existingUser = await factories.user.build({
                    emailConfirmed: true,
                });
                const email = existingUser.email;
                const password = existingUser.password;
                existingUser.encryptPassword();
                await existingUser.save();
                await typeormHelper.expectDataToExistInDb(
                    {
                        email: existingUser.email,
                    },
                    UserEntity,
                );

                const { status, body } = await supertest(server).post(uri).send({ email, password });
                expect(status).to.equal(200);
                expectBodyToBeValidAuthResponse(body, existingUser);
            });
        });

        context('when the credentials are invalid', () => {
            it('returns an error', async function () {
                this.timeout(8000);
                const factories = await typeormHelper.getFactories();
                const existingUser = await factories.user.build({});
                const email = existingUser.email;
                const wrongPassword = 'wrongPassword';
                existingUser.encryptPassword();
                await existingUser.save();
                await typeormHelper.expectDataToExistInDb(
                    {
                        email: existingUser.email,
                    },
                    UserEntity,
                );
                const validationError = {
                    value: wrongPassword,
                    property: 'password',
                    children: [],
                    constraints: {
                        isValidCredential: 'Invalid Credentials',
                    },
                };
                const { status, body } = await supertest(server).post(uri).send({ email, password: wrongPassword });
                expect(status).to.equal(400);
                expect(body).to.have.property('errors').and.not.be.empty;
                expectArrayToContainObjectWithProperties(body.errors, validationError);
            });
        });
    });
});
