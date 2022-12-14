import supertest from 'supertest';
import server from '@server/index';
import { expect } from 'chai';
import typeormHelper from '@testHelpers/typeormHelper';
import { IsUniqueInDbErrorMessage } from '@validation/constraints/IsUniqueInDb';
import { UserEntity } from '@entities/UserEntity';
import { expectArrayToContainObjectWithProperties } from '@testHelpers/expectArrayToContainObjectWithProperties';
import sinon from 'sinon';
import EmailConfirmationService from '@services/TokenVerifiers/EmailConfirmationService';
import stubs from '@testHelpers/stubs';

describe('e2e:registration', function () {
    const sandbox = sinon.createSandbox();

    before(async () => await typeormHelper.connect());
    after(async () => {
        await typeormHelper.close();
        sandbox.restore();
    });

    const uri = '/auth/email/register';
    describe(`POST ${uri}`, () => {
        context('when the data empty', () => {
            it('returns validation errors', done => {
                supertest(server)
                    .post(uri)
                    .end((err, res) => {
                        const { status, type, body } = res;
                        expect(status).to.equal(400);
                        expect(type).to.equal('application/json');
                        expect(body).to.have.property('errors').and.not.be.empty;
                        expect(body).to.have.property('data').and.be.empty;
                        done();
                    });
            });
        });

        context('when the email already exists', () => {
            it('returns email already exists errors', async function () {
                const factories = await typeormHelper.getFactories();
                const existingUser = await factories.user.create({});
                await typeormHelper.expectDataToExistInDb(
                    {
                        email: existingUser.email,
                    },
                    UserEntity,
                );
                const newUser = factories.user.build({
                    email: existingUser.email,
                });
                const validationError = {
                    value: existingUser.email,
                    property: 'email',
                    children: [],
                    constraints: {
                        isUniqueInDb: IsUniqueInDbErrorMessage('email', existingUser.email),
                    },
                };
                const { status, body } = await supertest(server).post(uri).send(newUser);
                expect(status).to.equal(400);
                expect(body).to.have.property('errors').and.not.be.empty;
                expectArrayToContainObjectWithProperties(body.errors, validationError);
            });
        });

        context('when the data is valid', () => {
            it('creates a user', async function () {
                sandbox.stub(EmailConfirmationService, 'getInstance').returns(stubs.emailConfirmationService(sandbox));
                const factories = await typeormHelper.getFactories();
                const newUser = factories.user.build({});
                const { status, body } = await supertest(server).post(uri).send(newUser);

                expect(status, JSON.stringify({ status, body })).to.equal(200);
                expect(body, JSON.stringify(body)).to.deep.include({
                    status: 'userCreated',
                    message: 'email confirmation sent',
                });
            });
        });
    });
});
