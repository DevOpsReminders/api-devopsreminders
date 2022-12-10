import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Table } from 'typeorm';
import { pluralize, underscore } from 'inflection';

export default class CakePhpNamingStrategy extends SnakeNamingStrategy {
    tableName(className: string, customName: string): string {
        return customName || pluralize(underscore(className.replace('Entity', ''), false));
    }

    indexName(tableOrName: Table | string, columnNames: string[], where?: string): string {
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const replacedTableName = tableName.replace('.', '_');
        let key = `${replacedTableName.substring(0, 10)}_${clonedColumnNames.join('_').substring(0, 10)}`;
        if (where) key += `_${where}`;

        return key.substring(0, 20);
    }
}
