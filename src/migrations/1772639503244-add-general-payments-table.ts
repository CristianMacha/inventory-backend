import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGeneralPaymentsTable1772639503244 implements MigrationInterface {
    name = 'AddGeneralPaymentsTable1772639503244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`general_payments\` (\`id\` varchar(255) NOT NULL, \`type\` enum ('INCOME', 'EXPENSE') NOT NULL, \`category\` enum ('SALARY', 'RENT', 'UTILITIES', 'TRANSPORT', 'MATERIAL_SALE', 'CLIENT_ADVANCE', 'SUPPLIER_REFUND', 'BANK_FEES', 'OTHER_EXPENSE', 'OTHER_INCOME') NOT NULL, \`description\` varchar(500) NULL, \`amount\` decimal(12,2) NOT NULL, \`paymentMethod\` enum ('CASH', 'BANK_TRANSFER') NOT NULL, \`paymentDate\` date NOT NULL, \`reference\` varchar(255) NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_general_payments_paymentDate\` (\`paymentDate\`), INDEX \`IDX_general_payments_category\` (\`category\`), INDEX \`IDX_general_payments_type\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_general_payments_type\` ON \`general_payments\``);
        await queryRunner.query(`DROP INDEX \`IDX_general_payments_category\` ON \`general_payments\``);
        await queryRunner.query(`DROP INDEX \`IDX_general_payments_paymentDate\` ON \`general_payments\``);
        await queryRunner.query(`DROP TABLE \`general_payments\``);
    }

}
