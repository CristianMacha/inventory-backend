import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSupplierReturnDocument1772761882306 implements MigrationInterface {
  name = 'AddSupplierReturnDocument1772761882306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`supplier_returns\` ADD \`documentPath\` varchar(500) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`supplier_returns\` DROP COLUMN \`documentPath\``,
    );
  }
}
