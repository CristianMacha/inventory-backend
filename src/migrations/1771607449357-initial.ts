import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1771607449357 implements MigrationInterface {
  name = 'Initial1771607449357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`external_id\` varchar(255) NULL, \`provider\` varchar(50) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`abbreviation\` varchar(50) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_8b0be371d28245da6e4f4b6187\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`levels\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`sortOrder\` int NOT NULL DEFAULT '0', \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_172e8f034ced78845089cca978\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`finishes\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`abbreviation\` varchar(50) NULL, \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_7ad76b3cc3a0f1aa4f421322ac\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`categoryId\` varchar(255) NOT NULL, \`levelId\` varchar(255) NOT NULL, \`finishId\` varchar(255) NOT NULL, \`brandId\` varchar(255) NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_products_name\` (\`name\`), INDEX \`IDX_products_finishId\` (\`finishId\`), INDEX \`IDX_products_levelId\` (\`levelId\`), INDEX \`IDX_products_categoryId\` (\`categoryId\`), INDEX \`IDX_products_brandId\` (\`brandId\`), UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`brands\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_96db6bbbaa6f23cad26871339b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`suppliers\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`abbreviation\` varchar(50) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_suppliers_name\` (\`name\`), UNIQUE INDEX \`IDX_5b5720d9645cee7396595a16c9\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bundles\` (\`id\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, \`supplierId\` varchar(255) NOT NULL, \`lotNumber\` varchar(255) NULL, \`thicknessCm\` decimal(10,2) NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_bundles_supplierId\` (\`supplierId\`), INDEX \`IDX_bundles_productId\` (\`productId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`slabs\` (\`id\` varchar(255) NOT NULL, \`bundleId\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`widthCm\` decimal(10,2) NOT NULL, \`heightCm\` decimal(10,2) NOT NULL, \`status\` enum ('AVAILABLE', 'RESERVED', 'SOLD') NOT NULL DEFAULT 'AVAILABLE', \`description\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_slabs_code\` (\`code\`), INDEX \`IDX_slabs_status\` (\`status\`), INDEX \`IDX_slabs_bundleId\` (\`bundleId\`), UNIQUE INDEX \`IDX_83dbd6cd07d8c44c636664bfc7\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_suppliers\` (\`id\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, \`supplierId\` varchar(255) NOT NULL, \`isPrimary\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_product_suppliers_supplierId\` (\`supplierId\`), INDEX \`IDX_product_suppliers_productId\` (\`productId\`), UNIQUE INDEX \`UQ_product_supplier\` (\`productId\`, \`supplierId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles_permissions\` (\`role_id\` varchar(36) NOT NULL, \`permission_id\` varchar(36) NOT NULL, INDEX \`IDX_7d2dad9f14eddeb09c256fea71\` (\`role_id\`), INDEX \`IDX_337aa8dba227a1fe6b73998307\` (\`permission_id\`), PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_roles\` (\`user_id\` varchar(36) NOT NULL, \`role_id\` varchar(36) NOT NULL, INDEX \`IDX_e4435209df12bc1f001e536017\` (\`user_id\`), INDEX \`IDX_1cf664021f00b9cc1ff95e17de\` (\`role_id\`), PRIMARY KEY (\`user_id\`, \`role_id\`)) ENGINE=InnoDB`,
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
      `ALTER TABLE \`bundles\` ADD CONSTRAINT \`FK_adfa350c30d481a156772d25b49\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` ADD CONSTRAINT \`FK_8321070199620f78ff60ed168f4\` FOREIGN KEY (\`supplierId\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`slabs\` ADD CONSTRAINT \`FK_61515229da3ff47ab61cb4e9c31\` FOREIGN KEY (\`bundleId\`) REFERENCES \`bundles\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` ADD CONSTRAINT \`FK_e61e7c3154bbf93be6480f86e1a\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` ADD CONSTRAINT \`FK_24565cd85eadd13f60e28975222\` FOREIGN KEY (\`supplierId\`) REFERENCES \`suppliers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
      `ALTER TABLE \`product_suppliers\` DROP FOREIGN KEY \`FK_24565cd85eadd13f60e28975222\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` DROP FOREIGN KEY \`FK_e61e7c3154bbf93be6480f86e1a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`slabs\` DROP FOREIGN KEY \`FK_61515229da3ff47ab61cb4e9c31\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP FOREIGN KEY \`FK_8321070199620f78ff60ed168f4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP FOREIGN KEY \`FK_adfa350c30d481a156772d25b49\``,
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
      `DROP INDEX \`IDX_83dbd6cd07d8c44c636664bfc7\` ON \`slabs\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_slabs_bundleId\` ON \`slabs\``);
    await queryRunner.query(`DROP INDEX \`IDX_slabs_status\` ON \`slabs\``);
    await queryRunner.query(`DROP INDEX \`IDX_slabs_code\` ON \`slabs\``);
    await queryRunner.query(`DROP TABLE \`slabs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bundles_productId\` ON \`bundles\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bundles_supplierId\` ON \`bundles\``,
    );
    await queryRunner.query(`DROP TABLE \`bundles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_5b5720d9645cee7396595a16c9\` ON \`suppliers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_suppliers_name\` ON \`suppliers\``,
    );
    await queryRunner.query(`DROP TABLE \`suppliers\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_96db6bbbaa6f23cad26871339b\` ON \`brands\``,
    );
    await queryRunner.query(`DROP TABLE \`brands\``);
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
    await queryRunner.query(`DROP TABLE \`finishes\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_172e8f034ced78845089cca978\` ON \`levels\``,
    );
    await queryRunner.query(`DROP TABLE \`levels\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8b0be371d28245da6e4f4b6187\` ON \`categories\``,
    );
    await queryRunner.query(`DROP TABLE \`categories\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`permissions\``);
  }
}
