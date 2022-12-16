import { MigrationInterface, QueryRunner } from 'typeorm';

export class diff1671168478607 implements MigrationInterface {
    name = 'diff1671168478607';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`email_confirmed\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`email_confirmed\`
        `);
    }
}
