import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWorkshopMovementsTable1773346501717 implements MigrationInterface {
    name = 'CreateWorkshopMovementsTable1773346501717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workshop_materials\` DROP COLUMN \`stock\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`workshop_materials\` ADD \`stock\` decimal(12,3) NOT NULL DEFAULT '0.000'`);
    }

}
