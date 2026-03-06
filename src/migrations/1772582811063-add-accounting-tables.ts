import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountingTables1772582811063 implements MigrationInterface {
  name = 'AddAccountingTables1772582811063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_bundles_purchaseInvoiceId\` ON \`bundles\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_invoices\` ADD \`paidAmount\` decimal(12,2) NOT NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`jobs\` ADD \`paidAmount\` decimal(12,2) NOT NULL DEFAULT '0.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`jobs\` DROP COLUMN \`paidAmount\``);
    await queryRunner.query(
      `ALTER TABLE \`purchase_invoices\` DROP COLUMN \`paidAmount\``,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_bundles_purchaseInvoiceId\` ON \`bundles\` (\`purchaseInvoiceId\`)`,
    );
  }
}
