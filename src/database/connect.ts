import { DataSource } from 'typeorm';
import config from '@config/index';

export let AppDataSource: DataSource;

export const dbConnect = async () => {
    if (!AppDataSource) {
        AppDataSource = new DataSource(config.database);
    }
    return AppDataSource.isInitialized ? AppDataSource : await AppDataSource.initialize();
};
