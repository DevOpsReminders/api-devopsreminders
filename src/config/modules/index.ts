import databaseConfig from '@config/modules/databaseConfig';
import serverConfig from '@config/modules/serverConfig';
import authConfig from '@config/modules/authConfig';
import emailsConfig from '@config/modules/emailsConfig';

const modules = {
    auth: authConfig,
    database: databaseConfig,
    server: serverConfig,
    email: emailsConfig,
};

export type AppConfig = typeof modules;
export default modules;
