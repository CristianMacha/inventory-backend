import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentSlabId1772657231777 implements MigrationInterface {
  name = 'AddParentSlabId1772657231777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`slabs\` ADD \`parentSlabId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_slabs_parentSlabId\` ON \`slabs\` (\`parentSlabId\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_slabs_parentSlabId\` ON \`slabs\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`slabs\` DROP COLUMN \`parentSlabId\``,
    );
  }
}
