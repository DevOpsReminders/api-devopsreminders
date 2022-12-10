import { expect } from 'chai';
import { EnvClass } from '@utils/Env';

describe('EnvClass', function () {
    const data = {
        A_STRING: 'a string',
        A_NUMBER_STR: '3',
        A_NUMBER_INT: 4,
        A_BOOLEAN_STR_TRUE: 'true',
        A_BOOLEAN_STR_FALSE: 'false',
        A_BOOLEAN_INT_TRUE: 1,
        A_BOOLEAN_INT_FALSE: 0,
    };
    const env = new EnvClass(data);

    context('getting strings', () => {
        context('when the string exists', () => {
            it('returns the value', () => {
                const actual = env.asString('A_STRING');
                const expected = data.A_STRING;
                expect(actual).to.equal(expected);
            });
        });

        context('when the string does not exists', () => {
            it('returns the fallback', () => {
                const expected = 'another string';
                const actual = env.asString('B_STRING', expected);
                expect(actual).to.equal(expected);
            });
        });
    });

    context('getting numbers', () => {
        context('when the number exists as a string', () => {
            it('returns the value as a number', () => {
                const actual = env.asNumber('A_NUMBER_STR');
                const expected = Number(data.A_NUMBER_STR);
                expect(actual).to.equal(expected);
            });
        });

        context('when the number exists as a number', () => {
            it('returns the value as a number', () => {
                const actual = env.asNumber('A_NUMBER_INT');
                const expected = Number(data.A_NUMBER_INT);
                expect(actual).to.equal(expected);
            });
        });

        context('when the number does not exists', () => {
            it('returns the fallback', () => {
                const expected = 44;
                const actual = env.asNumber('B_NUMBER', expected);
                expect(actual).to.equal(expected);
            });
        });
    });

    context('getting booleans', () => {
        context('when the boolean exists', () => {
            it('returns the value as a boolean', () => {
                expect(env.asBoolean('A_BOOLEAN_STR_TRUE')).to.equal(true);
                expect(env.asBoolean('A_BOOLEAN_STR_FALSE')).to.equal(false);
                expect(env.asBoolean('A_BOOLEAN_INT_TRUE')).to.equal(true);
                expect(env.asBoolean('A_BOOLEAN_INT_FALSE')).to.equal(false);
            });
        });

        context('when the boolean does not exists', () => {
            it('returns the fallback', () => {
                expect(env.asBoolean('B_BOOLEAN', true)).to.equal(true);
                expect(env.asBoolean('B_BOOLEAN', false)).to.equal(false);
            });
        });
    });

    context('Identifying NODE_ENV', () => {
        context('isDev', () => {
            it('returns true when NODE_ENV is development', () => {
                expect(new EnvClass({ NODE_ENV: 'development' }).isDev()).to.be.equal(true);

                expect(new EnvClass({ NODE_ENV: 'develop' }).isDev()).to.be.equal(false);
            });
        });
    });
});
