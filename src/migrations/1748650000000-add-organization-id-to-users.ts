import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationIdToUsers1748650000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD COLUMN \`organization_id\` varchar(36) NULL DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`organization_id\``,
    );
  }
}
