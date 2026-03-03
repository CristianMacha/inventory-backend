import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSupplierReturns1772033800523 implements MigrationInterface {
  name = 'AddSupplierReturns1772033800523';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`slabs\` CHANGE \`status\` \`status\` enum ('AVAILABLE', 'RESERVED', 'SOLD', 'RETURNED') NOT NULL DEFAULT 'AVAILABLE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`slabs\` CHANGE \`status\` \`status\` enum ('AVAILABLE', 'RESERVED', 'SOLD') NOT NULL DEFAULT 'AVAILABLE'`,
    );
  }
}
