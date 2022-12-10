import { DataSource } from 'typeorm';
import config from '@config/index';

export default new DataSource(config.database);
