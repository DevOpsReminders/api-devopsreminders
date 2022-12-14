import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import path from 'path';
import Env from '@utils/Env';
import CakePhpNamingStrategy from '@database/core/CakePhpNamingStrategy';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const databaseDir = path.join(__dirname, '..', '..', 'database');
type DatabaseConfig = (SqliteConnectionOptions | MysqlConnectionOptions) & { url: string };
const databaseConfig: DatabaseConfig = {
    type: 'mariadb',
    connectorPackage: 'mysql2',
    supportBigNumbers: true,
    charset: 'utf8mb4',
    timezone: 'Z',
    url: Env.asString('DATABASE_URI'),
    synchronize: false,
    logging: Env.asBoolean('DATABASE_LOGGING'),
    entities: [`${databaseDir}/../entities/**/*.{js,ts}`],
    subscribers: [`${databaseDir}/subscribers/*.{js,ts}`],
    migrations: [`${databaseDir}/migrations/*.{js,ts}`],
    namingStrategy: new CakePhpNamingStrategy(),
    migrationsTableName: 'migrations',
};
export default databaseConfig;
