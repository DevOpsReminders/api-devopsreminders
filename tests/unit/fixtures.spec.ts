import fixtures from '@testHelpers/fixtures';
import { expect } from 'chai';

describe('fixtures', () => {
    context('getEmailTemplate', () => {
        it('gets email templates', async () => {
            const sampleTxt = await fixtures.getEmailTemplate('sample.txt');
            expect(sampleTxt)
                .to.be.a('string')
                .and.satisfy((tpl: string) => {
                    return tpl.replace(/\n/, '') === 'Name: <%= name %>Email: <%= email %>';
                });
        });
    });

    context('getJson', () => {
        it('gets json file', async () => {
            const sampleJson = await fixtures.getJson('sample');
            expect(sampleJson).to.be.a('string');

            expect(JSON.parse(sampleJson)).to.have.keys(['foo', 'fizz']);
            expect(JSON.parse(sampleJson).foo).to.equal('bar');
            expect(JSON.parse(sampleJson).fizz).to.equal('bazz');
        });
    });
});
