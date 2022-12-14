import databaseConfig from '@config/modules/databaseConfig';
import serverConfig from '@config/modules/serverConfig';
import authConfig from '@config/modules/authConfig';

const modules = {
    auth: authConfig,
    database: databaseConfig,
    server: serverConfig,
};

export type AppConfig = typeof modules;
export default modules;
