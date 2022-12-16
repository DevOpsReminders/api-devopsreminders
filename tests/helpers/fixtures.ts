import path from 'path';
import fs from 'fs/promises';

const fixturesPath = path.join(__dirname, '..', 'fixtures');
const templatesPath = path.join(fixturesPath, 'emailTemplates');

const getFile = async (filePathName: string): Promise<string> => {
    const source = await fs.readFile(filePathName, 'utf-8');
    return source.toString();
};

const fixtures = {
    getJson: async (fileName: string) => {
        return getFile(`${fixturesPath}/json/${fileName}.json`);
    },
    getEmailTemplate: async (fileName: string) => {
        const [dir] = fileName.split('.', 2);
        return getFile(`${templatesPath}/${dir}/${fileName}`);
    },
};

export default fixtures;
