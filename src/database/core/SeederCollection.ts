import { ClassConstructor } from 'class-transformer';
import SeederInterface from '@database/core/SeederInterface';
import { DataSource } from 'typeorm';

export default class SeederCollection {
    collection: Map<string, ClassConstructor<SeederInterface>> = new Map<string, ClassConstructor<SeederInterface>>();
    dataSource: DataSource;

    constructor(classMap: Record<string, ClassConstructor<SeederInterface>>, dataSource: DataSource) {
        this.dataSource = dataSource;
        Object.entries(classMap).forEach(([name, classConstructor]) => {
            this.collection.set(name, classConstructor);
        });
    }

    async run(name: string): Promise<unknown> {
        const classConstructor = this.collection.get(name);
        if (!classConstructor) {
            throw new Error(`No seeder by the name of "${name}"`);
        }
        const seeder: SeederInterface = new classConstructor(this.dataSource.manager);
        return seeder.run();
    }
}
