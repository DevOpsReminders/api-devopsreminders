import { program } from 'commander';

import { ClassConstructor } from 'class-transformer';
import SeederInterface from '@database/core/SeederInterface';
import UserSeeder from '@database/seeders/UserSeeder';
import SeederCollection from '@database/core/SeederCollection';
import { dbConnect } from '@database/connect';

const seeders: Record<string, ClassConstructor<SeederInterface>> = {
    users: UserSeeder,
};

const run = async (name: string) => {
    try {
        const dataSource = await dbConnect();
        const seederCollection = new SeederCollection(seeders, dataSource);
        await seederCollection.run(name);
        await dataSource.destroy();
    } catch (error) {
        throw new Error(`Error running "${name}" seeder: ${(error as Error).message}`);
    }
};

program
    .name('seedRunner')
    .description('seeds the database with data using seeder classes')
    .argument('<seeder type>', 'The seeder type')
    .action(run);

program.parse();
