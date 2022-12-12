import { MigrationInterface, QueryRunner } from 'typeorm';

export class diff1670787768229 implements MigrationInterface {
    name = 'diff1670787768229';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`password\` varchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`password\`
        `);
    }
}
