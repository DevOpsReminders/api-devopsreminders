import { MigrationInterface, QueryRunner } from "typeorm";

export class diff1670709835406 implements MigrationInterface {
    name = 'diff1670709835406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted\` datetime(6) NULL,
                \`name\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`avatar\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }

}
