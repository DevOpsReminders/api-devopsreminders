import Env from '@utils/Env';

const serverConfig = {
    host: Env.asString('HOST'),
    port: Env.asNumber('PORT'),
    baseUrl: Env.asString('BASE_URL'),
};

export default serverConfig;
