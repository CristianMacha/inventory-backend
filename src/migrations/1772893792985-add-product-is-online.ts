import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductIsOnline1772893792985 implements MigrationInterface {
    name = 'AddProductIsOnline1772893792985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`isOnline\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`isOnline\``);
    }

}
