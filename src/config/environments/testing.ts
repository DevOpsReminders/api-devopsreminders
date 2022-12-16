import { DeepPartial } from 'typeorm';
import modules, { AppConfig } from '@config/modules';
import path from 'path';

const ROOT_DIR = path.join(__dirname, '..', '..', '..');
const templatesPath = path.join(ROOT_DIR, 'tests', 'fixtures', 'emailTemplates');

const config: DeepPartial<AppConfig> = {
    server: {
        port: 5000,
        useHttps: false,
        baseUrl: `http://${modules.server.hostname}:5000/`,
    },
    database: {
        ...modules.database,
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        synchronize: true,
        logging: false,
        poolSize: undefined,
        flags: undefined,
    },
    email: {
        templatesPath,
    },
};

export default config;
