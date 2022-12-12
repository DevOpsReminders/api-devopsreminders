import { MigrationInterface, QueryRunner } from 'typeorm';

export class diff1670787831901 implements MigrationInterface {
    name = 'diff1670787831901';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`avatar\` \`avatar\` varchar(255) NOT NULL
        `);
    }
}
