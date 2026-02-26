import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyPurchaseInvoiceEntity1772039724682 implements MigrationInterface {
    name = 'ModifyPurchaseInvoiceEntity1772039724682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supplier_returns\` DROP FOREIGN KEY \`FK_supplier_returns_purchaseInvoiceId\``);
        await queryRunner.query(`ALTER TABLE \`supplier_return_items\` DROP FOREIGN KEY \`FK_supplier_return_items_slabId\``);
        await queryRunner.query(`ALTER TABLE \`supplier_return_items\` DROP FOREIGN KEY \`FK_supplier_return_items_supplierReturnId\``);
        await queryRunner.query(`ALTER TABLE \`bundles\` ADD \`purchaseInvoiceId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`supplier_return_items\` ADD CONSTRAINT \`FK_79b2491d5a9dcd410f3a532a063\` FOREIGN KEY (\`supplierReturnId\`) REFERENCES \`supplier_returns\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`supplier_return_items\` DROP FOREIGN KEY \`FK_79b2491d5a9dcd410f3a532a063\``);
        await queryRunner.query(`ALTER TABLE \`bundles\` DROP COLUMN \`purchaseInvoiceId\``);
        await queryRunner.query(`ALTER TABLE \`supplier_return_items\` ADD CONSTRAINT \`FK_supplier_return_items_supplierReturnId\` FOREIGN KEY (\`supplierReturnId\`) REFERENCES \`supplier_returns\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`supplier_return_items\` ADD CONSTRAINT \`FK_supplier_return_items_slabId\` FOREIGN KEY (\`slabId\`) REFERENCES \`slabs\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`supplier_returns\` ADD CONSTRAINT \`FK_supplier_returns_purchaseInvoiceId\` FOREIGN KEY (\`purchaseInvoiceId\`) REFERENCES \`purchase_invoices\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
