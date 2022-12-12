import databaseConfig from '@config/databaseConfig';
import serverConfig from '@config/serverConfig';
import authConfig from '@config/authConfig';

const appConfig = {
    auth: authConfig,
    database: databaseConfig,
    server: serverConfig,
};
export default appConfig;
