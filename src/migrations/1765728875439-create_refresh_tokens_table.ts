import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefreshTokensTable1765728875439 implements MigrationInterface {
    name = 'CreateRefreshTokensTable1765728875439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`id\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`tokenHash\` varchar(255) NOT NULL, \`isRevoked\` tinyint NOT NULL DEFAULT 0, \`expiresAt\` datetime NOT NULL, \`createdAt\` datetime NOT NULL, INDEX \`IDX_610102b60fea1455310ccd299d\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_610102b60fea1455310ccd299d\` ON \`refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
    }

}
