import fileExists from '@utils/fileExists';
import { expect } from 'chai';

describe('fileExists', () => {
    it('returns true when the file exists', async () => {
        const exists = await fileExists(__filename);
        expect(exists).to.be.true;
    });

    it('returns false when the file does not exist', async () => {
        const exists = await fileExists(__filename + '.aBadExt');
        expect(exists).to.be.false;
    });
});
