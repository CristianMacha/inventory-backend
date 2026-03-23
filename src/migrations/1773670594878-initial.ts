import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1773670594878 implements MigrationInterface {
  name = 'Initial1773670594878';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`workshop_suppliers\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`phone\` varchar(50) NULL, \`email\` varchar(255) NULL, \`address\` varchar(500) NULL, \`notes\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_workshop_suppliers_name\` (\`name\`), UNIQUE INDEX \`IDX_b8eb7c2c3769f30ce56de3c26e\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workshop_categories\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(500) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_workshop_categories_name\` (\`name\`), UNIQUE INDEX \`IDX_42e59644f277b8ad6ca93882c7\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workshop_tools\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(500) NULL, \`status\` enum ('available', 'in_use', 'in_repair', 'retired') NOT NULL DEFAULT 'available', \`categoryId\` varchar(255) NULL, \`supplierId\` varchar(255) NULL, \`imagePublicId\` varchar(1000) NULL, \`purchasePrice\` decimal(10,2) NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_workshop_tools_status\` (\`status\`), INDEX \`IDX_workshop_tools_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workshop_tool_movements\` (\`id\` varchar(255) NOT NULL, \`toolId\` varchar(255) NOT NULL, \`previousStatus\` enum ('available', 'in_use', 'in_repair', 'retired') NOT NULL, \`newStatus\` enum ('available', 'in_use', 'in_repair', 'retired') NOT NULL, \`jobId\` varchar(255) NULL, \`notes\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_wtm_createdAt\` (\`createdAt\`), INDEX \`IDX_wtm_toolId\` (\`toolId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workshop_materials\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(500) NULL, \`unit\` varchar(50) NOT NULL, \`minStock\` decimal(12,3) NOT NULL DEFAULT '0.000', \`unitPrice\` decimal(10,2) NULL, \`categoryId\` varchar(255) NULL, \`supplierId\` varchar(255) NULL, \`imagePublicId\` varchar(1000) NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_workshop_materials_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workshop_material_movements\` (\`id\` varchar(255) NOT NULL, \`materialId\` varchar(255) NOT NULL, \`delta\` decimal(12,3) NOT NULL, \`reason\` enum ('compra', 'uso_job', 'devolucion', 'ajuste_inventario', 'otro') NOT NULL, \`jobId\` varchar(255) NULL, \`notes\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_wmm_createdAt\` (\`createdAt\`), INDEX \`IDX_wmm_materialId\` (\`materialId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_permissions_name\` (\`name\`), UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_roles_name\` (\`name\`), UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`external_id\` varchar(255) NULL, \`provider\` varchar(50) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_users_provider_externalId\` (\`provider\`, \`external_id\`), INDEX \`IDX_users_externalId\` (\`external_id\`), UNIQUE INDEX \`IDX_users_email\` (\`email\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`supplier_returns\` (\`id\` varchar(255) NOT NULL, \`purchaseInvoiceId\` varchar(255) NOT NULL, \`supplierId\` varchar(255) NOT NULL, \`returnDate\` date NOT NULL, \`status\` enum ('DRAFT', 'SENT', 'CREDITED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT', \`notes\` text NULL, \`documentPath\` varchar(500) NULL, \`creditAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_supplier_returns_purchaseInvoiceId\` (\`purchaseInvoiceId\`), INDEX \`IDX_supplier_returns_status\` (\`status\`), INDEX \`IDX_supplier_returns_supplierId\` (\`supplierId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`supplier_return_items\` (\`id\` varchar(255) NOT NULL, \`supplierReturnId\` varchar(255) NOT NULL, \`slabId\` varchar(255) NOT NULL, \`bundleId\` varchar(255) NOT NULL, \`reason\` enum ('DEFECTIVE', 'BROKEN', 'WRONG_ITEM', 'OTHER') NOT NULL DEFAULT 'DEFECTIVE', \`description\` varchar(500) NULL, \`unitCost\` decimal(12,2) NOT NULL, \`totalCost\` decimal(12,2) NOT NULL, INDEX \`IDX_supplier_return_items_slabId\` (\`slabId\`), INDEX \`IDX_supplier_return_items_returnId\` (\`supplierReturnId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`purchase_invoices\` (\`id\` varchar(255) NOT NULL, \`invoiceNumber\` varchar(255) NOT NULL, \`supplierId\` varchar(255) NOT NULL, \`invoiceDate\` date NOT NULL, \`dueDate\` date NULL, \`subtotal\` decimal(12,2) NOT NULL DEFAULT '0.00', \`taxAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`totalAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`paidAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`status\` enum ('DRAFT', 'RECEIVED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'DRAFT', \`notes\` text NULL, \`documentPath\` varchar(500) NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_purchase_invoices_status\` (\`status\`), INDEX \`IDX_purchase_invoices_supplierId\` (\`supplierId\`), UNIQUE INDEX \`IDX_purchase_invoices_invoiceNumber\` (\`invoiceNumber\`), UNIQUE INDEX \`IDX_4e0ba6ceaf1ea7f09cfb9bf69e\` (\`invoiceNumber\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`purchase_invoice_items\` (\`id\` varchar(255) NOT NULL, \`purchaseInvoiceId\` varchar(255) NOT NULL, \`bundleId\` varchar(255) NOT NULL, \`concept\` enum ('MATERIAL', 'FREIGHT', 'CUSTOMS', 'ADJUSTMENT', 'OTHER') NOT NULL DEFAULT 'MATERIAL', \`description\` varchar(500) NULL, \`unitCost\` decimal(12,2) NOT NULL, \`quantity\` int NOT NULL DEFAULT '1', \`totalCost\` decimal(12,2) NOT NULL, INDEX \`IDX_purchase_invoice_items_bundleId\` (\`bundleId\`), INDEX \`IDX_purchase_invoice_items_invoiceId\` (\`purchaseInvoiceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`jobs\` (\`id\` varchar(255) NOT NULL, \`projectName\` varchar(255) NOT NULL, \`clientName\` varchar(255) NOT NULL, \`clientPhone\` varchar(50) NULL, \`clientEmail\` varchar(255) NULL, \`clientAddress\` text NULL, \`status\` enum ('QUOTED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'QUOTED', \`scheduledDate\` date NULL, \`completedDate\` timestamp NULL, \`notes\` text NULL, \`subtotal\` decimal(12,2) NOT NULL DEFAULT '0.00', \`taxAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`totalAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`paidAmount\` decimal(12,2) NOT NULL DEFAULT '0.00', \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_jobs_clientName\` (\`clientName\`), INDEX \`IDX_jobs_projectName\` (\`projectName\`), INDEX \`IDX_jobs_status\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`job_items\` (\`id\` varchar(255) NOT NULL, \`jobId\` varchar(255) NOT NULL, \`slabId\` varchar(255) NOT NULL, \`description\` varchar(500) NULL, \`unitPrice\` decimal(12,2) NOT NULL, \`totalPrice\` decimal(12,2) NOT NULL, INDEX \`IDX_job_items_slabId\` (\`slabId\`), INDEX \`IDX_job_items_jobId\` (\`jobId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`suppliers\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`abbreviation\` varchar(50) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_suppliers_isActive\` (\`isActive\`), UNIQUE INDEX \`IDX_suppliers_name\` (\`name\`), UNIQUE INDEX \`IDX_5b5720d9645cee7396595a16c9\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`slabs\` (\`id\` varchar(255) NOT NULL, \`bundleId\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`widthCm\` decimal(10,2) NOT NULL, \`heightCm\` decimal(10,2) NOT NULL, \`status\` enum ('AVAILABLE', 'RESERVED', 'SOLD', 'RETURNING', 'RETURNED') NOT NULL DEFAULT 'AVAILABLE', \`parentSlabId\` varchar(36) NULL, \`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_slabs_parentSlabId\` (\`parentSlabId\`), UNIQUE INDEX \`IDX_slabs_code\` (\`code\`), INDEX \`IDX_slabs_status\` (\`status\`), INDEX \`IDX_slabs_bundleId\` (\`bundleId\`), UNIQUE INDEX \`IDX_83dbd6cd07d8c44c636664bfc7\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`brands\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_brands_name\` (\`name\`), UNIQUE INDEX \`IDX_96db6bbbaa6f23cad26871339b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`abbreviation\` varchar(50) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_categories_name\` (\`name\`), UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`levels\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`sortOrder\` int NOT NULL DEFAULT '0', \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_levels_name\` (\`name\`), UNIQUE INDEX \`IDX_172e8f034ced78845089cca978\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`finishes\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`abbreviation\` varchar(50) NULL, \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_finishes_name\` (\`name\`), UNIQUE INDEX \`IDX_7ad76b3cc3a0f1aa4f421322ac\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`isOnline\` tinyint NOT NULL DEFAULT 0, \`categoryId\` varchar(255) NOT NULL, \`levelId\` varchar(255) NOT NULL, \`finishId\` varchar(255) NOT NULL, \`brandId\` varchar(255) NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_products_name\` (\`name\`), INDEX \`IDX_products_finishId\` (\`finishId\`), INDEX \`IDX_products_levelId\` (\`levelId\`), INDEX \`IDX_products_categoryId\` (\`categoryId\`), INDEX \`IDX_products_brandId\` (\`brandId\`), UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_suppliers\` (\`id\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, \`supplierId\` varchar(255) NOT NULL, \`isPrimary\` tinyint NOT NULL DEFAULT 0, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_product_suppliers_supplierId\` (\`supplierId\`), INDEX \`IDX_product_suppliers_productId\` (\`productId\`), UNIQUE INDEX \`UQ_product_supplier\` (\`productId\`, \`supplierId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_images\` (\`id\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, \`publicId\` varchar(500) NOT NULL, \`isPrimary\` tinyint NOT NULL DEFAULT 0, \`sortOrder\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_product_images_productId\` (\`productId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`job_payments\` (\`id\` varchar(255) NOT NULL, \`jobId\` varchar(255) NOT NULL, \`amount\` decimal(12,2) NOT NULL, \`paymentMethod\` enum ('CASH', 'BANK_TRANSFER') NOT NULL, \`paymentDate\` date NOT NULL, \`reference\` varchar(255) NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_job_payments_paymentDate\` (\`paymentDate\`), INDEX \`IDX_job_payments_jobId\` (\`jobId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bundles\` (\`id\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, \`supplierId\` varchar(255) NOT NULL, \`purchaseInvoiceId\` varchar(255) NULL, \`imagePublicId\` varchar(500) NULL, \`lotNumber\` varchar(255) NULL, \`thicknessCm\` decimal(10,2) NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_bundles_supplierId\` (\`supplierId\`), INDEX \`IDX_bundles_productId\` (\`productId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`invoice_payments\` (\`id\` varchar(255) NOT NULL, \`invoiceId\` varchar(255) NOT NULL, \`amount\` decimal(12,2) NOT NULL, \`paymentMethod\` enum ('CASH', 'BANK_TRANSFER') NOT NULL, \`paymentDate\` date NOT NULL, \`reference\` varchar(255) NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_invoice_payments_paymentDate\` (\`paymentDate\`), INDEX \`IDX_invoice_payments_invoiceId\` (\`invoiceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`general_payments\` (\`id\` varchar(255) NOT NULL, \`type\` enum ('INCOME', 'EXPENSE') NOT NULL, \`category\` enum ('SALARY', 'RENT', 'UTILITIES', 'TRANSPORT', 'MATERIAL_SALE', 'CLIENT_ADVANCE', 'SUPPLIER_REFUND', 'BANK_FEES', 'OTHER_EXPENSE', 'OTHER_INCOME') NOT NULL, \`description\` varchar(500) NULL, \`amount\` decimal(12,2) NOT NULL, \`paymentMethod\` enum ('CASH', 'BANK_TRANSFER') NOT NULL, \`paymentDate\` date NOT NULL, \`reference\` varchar(255) NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_general_payments_paymentDate\` (\`paymentDate\`), INDEX \`IDX_general_payments_category\` (\`category\`), INDEX \`IDX_general_payments_type\` (\`type\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles_permissions\` (\`role_id\` varchar(36) NOT NULL, \`permission_id\` varchar(36) NOT NULL, INDEX \`IDX_7d2dad9f14eddeb09c256fea71\` (\`role_id\`), INDEX \`IDX_337aa8dba227a1fe6b73998307\` (\`permission_id\`), PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_roles\` (\`user_id\` varchar(36) NOT NULL, \`role_id\` varchar(36) NOT NULL, INDEX \`IDX_e4435209df12bc1f001e536017\` (\`user_id\`), INDEX \`IDX_1cf664021f00b9cc1ff95e17de\` (\`role_id\`), PRIMARY KEY (\`user_id\`, \`role_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`workshop_tools\` ADD CONSTRAINT \`FK_addec2f70ef5c3908d4e7d2caf6\` FOREIGN KEY (\`categoryId\`) REFERENCES \`workshop_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`workshop_tools\` ADD CONSTRAINT \`FK_6375baf710b8bfa5920a1662257\` FOREIGN KEY (\`supplierId\`) REFERENCES \`workshop_suppliers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`workshop_materials\` ADD CONSTRAINT \`FK_2dbb405918240ef960c185417d0\` FOREIGN KEY (\`categoryId\`) REFERENCES \`workshop_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`workshop_materials\` ADD CONSTRAINT \`FK_7b8fcb4046f61f82773e8aeaf4c\` FOREIGN KEY (\`supplierId\`) REFERENCES \`workshop_suppliers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_return_items\` ADD CONSTRAINT \`FK_79b2491d5a9dcd410f3a532a063\` FOREIGN KEY (\`supplierReturnId\`) REFERENCES \`supplier_returns\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_invoice_items\` ADD CONSTRAINT \`FK_40b06aeaf815e2cb709179f67d6\` FOREIGN KEY (\`purchaseInvoiceId\`) REFERENCES \`purchase_invoices\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_items\` ADD CONSTRAINT \`FK_7e619294de1bf3aafb2a900b804\` FOREIGN KEY (\`jobId\`) REFERENCES \`jobs\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`slabs\` ADD CONSTRAINT \`FK_61515229da3ff47ab61cb4e9c31\` FOREIGN KEY (\`bundleId\`) REFERENCES \`bundles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ea86d0c514c4ecbb5694cbf57df\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_1b95f76552b17cbcaab61799201\` FOREIGN KEY (\`levelId\`) REFERENCES \`levels\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_aa0929a3d1b4f0cb517f5aca7ea\` FOREIGN KEY (\`finishId\`) REFERENCES \`finishes\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` ADD CONSTRAINT \`FK_e61e7c3154bbf93be6480f86e1a\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` ADD CONSTRAINT \`FK_24565cd85eadd13f60e28975222\` FOREIGN KEY (\`supplierId\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_b367708bf720c8dd62fc6833161\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` ADD CONSTRAINT \`FK_adfa350c30d481a156772d25b49\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` ADD CONSTRAINT \`FK_8321070199620f78ff60ed168f4\` FOREIGN KEY (\`supplierId\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` ADD CONSTRAINT \`FK_7d2dad9f14eddeb09c256fea719\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` ADD CONSTRAINT \`FK_337aa8dba227a1fe6b73998307b\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_roles\` ADD CONSTRAINT \`FK_e4435209df12bc1f001e5360174\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_roles\` ADD CONSTRAINT \`FK_1cf664021f00b9cc1ff95e17de4\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users_roles\` DROP FOREIGN KEY \`FK_1cf664021f00b9cc1ff95e17de4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_roles\` DROP FOREIGN KEY \`FK_e4435209df12bc1f001e5360174\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_337aa8dba227a1fe6b73998307b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_7d2dad9f14eddeb09c256fea719\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP FOREIGN KEY \`FK_8321070199620f78ff60ed168f4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP FOREIGN KEY \`FK_adfa350c30d481a156772d25b49\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_b367708bf720c8dd62fc6833161\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` DROP FOREIGN KEY \`FK_24565cd85eadd13f60e28975222\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` DROP FOREIGN KEY \`FK_e61e7c3154bbf93be6480f86e1a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_aa0929a3d1b4f0cb517f5aca7ea\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_1b95f76552b17cbcaab61799201\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ea86d0c514c4ecbb5694cbf57df\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`slabs\` DROP FOREIGN KEY \`FK_61515229da3ff47ab61cb4e9c31\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`job_items\` DROP FOREIGN KEY \`FK_7e619294de1bf3aafb2a900b804\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_invoice_items\` DROP FOREIGN KEY \`FK_40b06aeaf815e2cb709179f67d6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplier_return_items\` DROP FOREIGN KEY \`FK_79b2491d5a9dcd410f3a532a063\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`workshop_materials\` DROP FOREIGN KEY \`FK_7b8fcb4046f61f82773e8aeaf4c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`workshop_materials\` DROP FOREIGN KEY \`FK_2dbb405918240ef960c185417d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`workshop_tools\` DROP FOREIGN KEY \`FK_6375baf710b8bfa5920a1662257\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`workshop_tools\` DROP FOREIGN KEY \`FK_addec2f70ef5c3908d4e7d2caf6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1cf664021f00b9cc1ff95e17de\` ON \`users_roles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e4435209df12bc1f001e536017\` ON \`users_roles\``,
    );
    await queryRunner.query(`DROP TABLE \`users_roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_337aa8dba227a1fe6b73998307\` ON \`roles_permissions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7d2dad9f14eddeb09c256fea71\` ON \`roles_permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`roles_permissions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_general_payments_type\` ON \`general_payments\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_general_payments_category\` ON \`general_payments\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_general_payments_paymentDate\` ON \`general_payments\``,
    );
    await queryRunner.query(`DROP TABLE \`general_payments\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_invoice_payments_invoiceId\` ON \`invoice_payments\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_invoice_payments_paymentDate\` ON \`invoice_payments\``,
    );
    await queryRunner.query(`DROP TABLE \`invoice_payments\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bundles_productId\` ON \`bundles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bundles_supplierId\` ON \`bundles\``,
    );
    await queryRunner.query(`DROP TABLE \`bundles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_job_payments_jobId\` ON \`job_payments\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_job_payments_paymentDate\` ON \`job_payments\``,
    );
    await queryRunner.query(`DROP TABLE \`job_payments\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_product_images_productId\` ON \`product_images\``,
    );
    await queryRunner.query(`DROP TABLE \`product_images\``);
    await queryRunner.query(
      `DROP INDEX \`UQ_product_supplier\` ON \`product_suppliers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_product_suppliers_productId\` ON \`product_suppliers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_product_suppliers_supplierId\` ON \`product_suppliers\``,
    );
    await queryRunner.query(`DROP TABLE \`product_suppliers\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_products_brandId\` ON \`products\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_products_categoryId\` ON \`products\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_products_levelId\` ON \`products\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_products_finishId\` ON \`products\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_products_name\` ON \`products\``);
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7ad76b3cc3a0f1aa4f421322ac\` ON \`finishes\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_finishes_name\` ON \`finishes\``);
    await queryRunner.query(`DROP TABLE \`finishes\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_172e8f034ced78845089cca978\` ON \`levels\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_levels_name\` ON \`levels\``);
    await queryRunner.query(`DROP TABLE \`levels\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_categories_name\` ON \`categories\``,
    );
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_96db6bbbaa6f23cad26871339b\` ON \`brands\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_brands_name\` ON \`brands\``);
    await queryRunner.query(`DROP TABLE \`brands\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_83dbd6cd07d8c44c636664bfc7\` ON \`slabs\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_slabs_bundleId\` ON \`slabs\``);
    await queryRunner.query(`DROP INDEX \`IDX_slabs_status\` ON \`slabs\``);
    await queryRunner.query(`DROP INDEX \`IDX_slabs_code\` ON \`slabs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_slabs_parentSlabId\` ON \`slabs\``,
    );
    await queryRunner.query(`DROP TABLE \`slabs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_5b5720d9645cee7396595a16c9\` ON \`suppliers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_suppliers_name\` ON \`suppliers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_suppliers_isActive\` ON \`suppliers\``,
    );
    await queryRunner.query(`DROP TABLE \`suppliers\``);
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
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_return_items_returnId\` ON \`supplier_return_items\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_return_items_slabId\` ON \`supplier_return_items\``,
    );
    await queryRunner.query(`DROP TABLE \`supplier_return_items\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_returns_supplierId\` ON \`supplier_returns\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_returns_status\` ON \`supplier_returns\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_supplier_returns_purchaseInvoiceId\` ON \`supplier_returns\``,
    );
    await queryRunner.query(`DROP TABLE \`supplier_returns\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_users_email\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_users_externalId\` ON \`users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_users_provider_externalId\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_roles_name\` ON \`roles\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_permissions_name\` ON \`permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`permissions\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_wmm_materialId\` ON \`workshop_material_movements\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_wmm_createdAt\` ON \`workshop_material_movements\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_material_movements\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_workshop_materials_name\` ON \`workshop_materials\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_materials\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_wtm_toolId\` ON \`workshop_tool_movements\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_wtm_createdAt\` ON \`workshop_tool_movements\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_tool_movements\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_workshop_tools_name\` ON \`workshop_tools\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_workshop_tools_status\` ON \`workshop_tools\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_tools\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_42e59644f277b8ad6ca93882c7\` ON \`workshop_categories\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_workshop_categories_name\` ON \`workshop_categories\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_categories\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_b8eb7c2c3769f30ce56de3c26e\` ON \`workshop_suppliers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_workshop_suppliers_name\` ON \`workshop_suppliers\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_suppliers\``);
  }
}
