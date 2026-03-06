import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImagesAndDocuments1772741089935 implements MigrationInterface {
  name = 'AddImagesAndDocuments1772741089935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_images\` (\`id\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, \`publicId\` varchar(500) NOT NULL, \`isPrimary\` tinyint NOT NULL DEFAULT 0, \`sortOrder\` int NOT NULL DEFAULT '0', \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_product_images_productId\` (\`productId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_invoices\` ADD \`documentPath\` varchar(500) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` ADD \`imagePublicId\` varchar(500) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_b367708bf720c8dd62fc6833161\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_b367708bf720c8dd62fc6833161\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bundles\` DROP COLUMN \`imagePublicId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`purchase_invoices\` DROP COLUMN \`documentPath\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_product_images_productId\` ON \`product_images\``,
    );
    await queryRunner.query(`DROP TABLE \`product_images\``);
  }
}
