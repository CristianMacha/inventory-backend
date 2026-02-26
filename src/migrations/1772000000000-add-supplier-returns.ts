import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSupplierReturns1772000000000 implements MigrationInterface {
  name = 'AddSupplierReturns1772000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`supplier_returns\` (
        \`id\` varchar(255) NOT NULL,
        \`purchaseInvoiceId\` varchar(255) NOT NULL,
        \`supplierId\` varchar(255) NOT NULL,
        \`returnDate\` date NOT NULL,
        \`status\` enum('DRAFT','SENT','CREDITED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
        \`notes\` text NULL,
        \`creditAmount\` decimal(12,2) NOT NULL DEFAULT '0.00',
        \`createdBy\` varchar(255) NOT NULL,
        \`updatedBy\` varchar(255) NOT NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` datetime(6) NULL,
        INDEX \`IDX_supplier_returns_supplierId\` (\`supplierId\`),
        INDEX \`IDX_supplier_returns_status\` (\`status\`),
        INDEX \`IDX_supplier_returns_purchaseInvoiceId\` (\`purchaseInvoiceId\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`supplier_return_items\` (
        \`id\` varchar(255) NOT NULL,
        \`supplierReturnId\` varchar(255) NOT NULL,
        \`slabId\` varchar(255) NOT NULL,
        \`bundleId\` varchar(255) NOT NULL,
        \`reason\` enum('DEFECTIVE','BROKEN','WRONG_ITEM','OTHER') NOT NULL DEFAULT 'DEFECTIVE',
        \`description\` varchar(500) NULL,
        \`unitCost\` decimal(12,2) NOT NULL,
        \`totalCost\` decimal(12,2) NOT NULL,
        INDEX \`IDX_supplier_return_items_returnId\` (\`supplierReturnId\`),
        INDEX \`IDX_supplier_return_items_slabId\` (\`slabId\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `ALTER TABLE \`supplier_returns\` ADD CONSTRAINT \`FK_supplier_returns_purchaseInvoiceId\` FOREIGN KEY (\`purchaseInvoiceId\`) REFERENCES \`purchase_invoices\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`supplier_return_items\` ADD CONSTRAINT \`FK_supplier_return_items_supplierReturnId\` FOREIGN KEY (\`supplierReturnId\`) REFERENCES \`supplier_returns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE \`supplier_return_items\` ADD CONSTRAINT \`FK_supplier_return_items_slabId\` FOREIGN KEY (\`slabId\`) REFERENCES \`slabs\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    // Add RETURNED to slab_status enum
    await queryRunner.query(
      `ALTER TABLE \`slabs\` MODIFY COLUMN \`status\` enum('AVAILABLE','RESERVED','SOLD','RETURNED') NOT NULL DEFAULT 'AVAILABLE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`supplier_return_items\` DROP FOREIGN KEY \`FK_supplier_return_items_slabId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_return_items\` DROP FOREIGN KEY \`FK_supplier_return_items_supplierReturnId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_returns\` DROP FOREIGN KEY \`FK_supplier_returns_purchaseInvoiceId\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_return_items_slabId\` ON \`supplier_return_items\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_return_items_returnId\` ON \`supplier_return_items\``,
    );
    await queryRunner.query(`DROP TABLE \`supplier_return_items\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_returns_purchaseInvoiceId\` ON \`supplier_returns\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_returns_status\` ON \`supplier_returns\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_returns_supplierId\` ON \`supplier_returns\``,
    );
    await queryRunner.query(`DROP TABLE \`supplier_returns\``);
    await queryRunner.query(
      `ALTER TABLE \`slabs\` MODIFY COLUMN \`status\` enum('AVAILABLE','RESERVED','SOLD') NOT NULL DEFAULT 'AVAILABLE'`,
    );
  }
}
