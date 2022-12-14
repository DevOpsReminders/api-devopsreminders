import { DeepPartial } from 'typeorm';
import modules, { AppConfig } from '@config/modules';

const config: DeepPartial<AppConfig> = {
    server: {
        useHttps: true,
        baseUrl: `https://${modules.server.hostname}:${modules.server.port}/`,
    },
};

export default config;
