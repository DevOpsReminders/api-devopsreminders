import { DeepPartial } from 'typeorm';
import modules, { AppConfig } from '@config/modules';

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
};

export default config;
