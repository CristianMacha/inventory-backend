import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTablesJobPurchasing1771942786226 implements MigrationInterface {
  name = 'AddTablesJobPurchasing1771942786226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`purchase_invoices\` (\`id\` varchar(255) NOT NULL, \`invoiceNumber\` varchar(255) NOT NULL, \`supplierId\` varchar(255) NOT NULL, \`invoiceDate\` date NOT NULL, \`dueDate\` date NULL, \`subtotal\` decimal(12,2) NOT NULL DEFAULT '0.00', \`taxAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`totalAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`status\` enum ('DRAFT', 'RECEIVED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'DRAFT', \`notes\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_purchase_invoices_status\` (\`status\`), INDEX \`IDX_purchase_invoices_supplierId\` (\`supplierId\`), UNIQUE INDEX \`IDX_purchase_invoices_invoiceNumber\` (\`invoiceNumber\`), UNIQUE INDEX \`IDX_4e0ba6ceaf1ea7f09cfb9bf69e\` (\`invoiceNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`purchase_invoice_items\` (\`id\` varchar(255) NOT NULL, \`purchaseInvoiceId\` varchar(255) NOT NULL, \`bundleId\` varchar(255) NOT NULL, \`concept\` enum ('MATERIAL', 'FREIGHT', 'CUSTOMS', 'ADJUSTMENT', 'OTHER') NOT NULL DEFAULT 'MATERIAL', \`description\` varchar(500) NULL, \`unitCost\` decimal(12,2) NOT NULL, \`quantity\` int NOT NULL DEFAULT '1', \`totalCost\` decimal(12,2) NOT NULL, INDEX \`IDX_purchase_invoice_items_bundleId\` (\`bundleId\`), INDEX \`IDX_purchase_invoice_items_invoiceId\` (\`purchaseInvoiceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`jobs\` (\`id\` varchar(255) NOT NULL, \`projectName\` varchar(255) NOT NULL, \`clientName\` varchar(255) NOT NULL, \`clientPhone\` varchar(50) NULL, \`clientEmail\` varchar(255) NULL, \`clientAddress\` text NULL, \`status\` enum ('QUOTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'QUOTED', \`scheduledDate\` date NULL, \`completedDate\` timestamp NULL, \`notes\` text NULL, \`subtotal\` decimal(12,2) NOT NULL DEFAULT '0.00', \`taxAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`totalAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_jobs_clientName\` (\`clientName\`), INDEX \`IDX_jobs_projectName\` (\`projectName\`), INDEX \`IDX_jobs_status\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`job_items\` (\`id\` varchar(255) NOT NULL, \`jobId\` varchar(255) NOT NULL, \`slabId\` varchar(255) NOT NULL, \`description\` varchar(500) NULL, \`unitPrice\` decimal(12,2) NOT NULL, \`totalPrice\` decimal(12,2) NOT NULL, INDEX \`IDX_job_items_slabId\` (\`slabId\`), INDEX \`IDX_job_items_jobId\` (\`jobId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_invoice_items\` ADD CONSTRAINT \`FK_40b06aeaf815e2cb709179f67d6\` FOREIGN KEY (\`purchaseInvoiceId\`) REFERENCES \`purchase_invoices\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_items\` ADD CONSTRAINT \`FK_7e619294de1bf3aafb2a900b804\` FOREIGN KEY (\`jobId\`) REFERENCES \`jobs\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`job_items\` DROP FOREIGN KEY \`FK_7e619294de1bf3aafb2a900b804\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_invoice_items\` DROP FOREIGN KEY \`FK_40b06aeaf815e2cb709179f67d6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_job_items_jobId\` ON \`job_items\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_job_items_slabId\` ON \`job_items\``,
    );
    await queryRunner.query(`DROP TABLE \`job_items\``);
    await queryRunner.query(`DROP INDEX \`IDX_jobs_status\` ON \`jobs\``);
    await queryRunner.query(`DROP INDEX \`IDX_jobs_projectName\` ON \`jobs\``);
    await queryRunner.query(`DROP INDEX \`IDX_jobs_clientName\` ON \`jobs\``);
    await queryRunner.query(`DROP TABLE \`jobs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_purchase_invoice_items_invoiceId\` ON \`purchase_invoice_items\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_purchase_invoice_items_bundleId\` ON \`purchase_invoice_items\``,
    );
    await queryRunner.query(`DROP TABLE \`purchase_invoice_items\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4e0ba6ceaf1ea7f09cfb9bf69e\` ON \`purchase_invoices\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_purchase_invoices_invoiceNumber\` ON \`purchase_invoices\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_purchase_invoices_supplierId\` ON \`purchase_invoices\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_purchase_invoices_status\` ON \`purchase_invoices\``,
    );
    await queryRunner.query(`DROP TABLE \`purchase_invoices\``);
  }
}
