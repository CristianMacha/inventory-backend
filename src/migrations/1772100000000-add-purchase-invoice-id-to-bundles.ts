import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPurchaseInvoiceIdToBundles1772100000000 implements MigrationInterface {
  name = 'AddPurchaseInvoiceIdToBundles1772100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bundles\` ADD \`purchaseInvoiceId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_bundles_purchaseInvoiceId\` ON \`bundles\` (\`purchaseInvoiceId\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_bundles_purchaseInvoiceId\` ON \`bundles\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP COLUMN \`purchaseInvoiceId\``,
    );
  }
}
