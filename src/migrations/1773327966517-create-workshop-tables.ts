import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkshopTables1773327966517 implements MigrationInterface {
  name = 'CreateWorkshopTables1773327966517';

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
      `CREATE TABLE \`workshop_materials\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(500) NULL, \`unit\` varchar(50) NOT NULL, \`stock\` decimal(12,3) NOT NULL DEFAULT '0.000', \`minStock\` decimal(12,3) NOT NULL DEFAULT '0.000', \`unitPrice\` decimal(10,2) NULL, \`categoryId\` varchar(255) NULL, \`supplierId\` varchar(255) NULL, \`imagePublicId\` varchar(1000) NULL, \`createdBy\` varchar(255) NOT NULL, \`updatedBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, INDEX \`IDX_workshop_materials_name\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `DROP INDEX \`IDX_workshop_materials_name\` ON \`workshop_materials\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_materials\``);
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
