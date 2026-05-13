import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizations1747180000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE organizations (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        storageLimitBytes BIGINT NOT NULL DEFAULT 10737418240,
        storageUsedBytes BIGINT NOT NULL DEFAULT 0,
        createdBy VARCHAR(36) NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP NOT NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE organizations`);
  }
}
