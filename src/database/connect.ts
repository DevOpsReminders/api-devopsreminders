import { DataSource } from 'typeorm';
import appConfig from '@config/index';

export let AppDataSource: DataSource | undefined = undefined;

export const dbConnect = async () => {
    if (!AppDataSource) {
        AppDataSource = new DataSource(appConfig.database);
    }
    return AppDataSource.isInitialized ? AppDataSource : await AppDataSource.initialize();
};
