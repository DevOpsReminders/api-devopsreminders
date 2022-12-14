import { DataSource } from 'typeorm';
import appConfig from '@config/index';

export default new DataSource(appConfig.database);
