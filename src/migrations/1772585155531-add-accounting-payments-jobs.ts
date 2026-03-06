import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountingPaymentsJobs1772585155531 implements MigrationInterface {
  name = 'AddAccountingPaymentsJobs1772585155531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`job_payments\` (\`id\` varchar(255) NOT NULL, \`jobId\` varchar(255) NOT NULL, \`amount\` decimal(12,2) NOT NULL, \`paymentMethod\` enum ('CASH', 'BANK_TRANSFER') NOT NULL, \`paymentDate\` date NOT NULL, \`reference\` varchar(255) NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_job_payments_paymentDate\` (\`paymentDate\`), INDEX \`IDX_job_payments_jobId\` (\`jobId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`invoice_payments\` (\`id\` varchar(255) NOT NULL, \`invoiceId\` varchar(255) NOT NULL, \`amount\` decimal(12,2) NOT NULL, \`paymentMethod\` enum ('CASH', 'BANK_TRANSFER') NOT NULL, \`paymentDate\` date NOT NULL, \`reference\` varchar(255) NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_invoice_payments_paymentDate\` (\`paymentDate\`), INDEX \`IDX_invoice_payments_invoiceId\` (\`invoiceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_invoice_payments_invoiceId\` ON \`invoice_payments\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_invoice_payments_paymentDate\` ON \`invoice_payments\``,
    );
    await queryRunner.query(`DROP TABLE \`invoice_payments\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_job_payments_jobId\` ON \`job_payments\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_job_payments_paymentDate\` ON \`job_payments\``,
    );
    await queryRunner.query(`DROP TABLE \`job_payments\``);
  }
}
