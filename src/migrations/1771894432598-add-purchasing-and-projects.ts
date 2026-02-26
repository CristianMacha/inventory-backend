import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPurchasingAndProjects1771894432598 implements MigrationInterface {
  name = 'AddPurchasingAndProjects1771894432598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`levels\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`finishes\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`suppliers\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_permissions_name\` ON \`permissions\` (\`name\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_roles_name\` ON \`roles\` (\`name\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_users_externalId\` ON \`users\` (\`external_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_users_email\` ON \`users\` (\`email\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_categories_name\` ON \`categories\` (\`name\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_levels_name\` ON \`levels\` (\`name\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_finishes_name\` ON \`finishes\` (\`name\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_brands_name\` ON \`brands\` (\`name\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_brands_name\` ON \`brands\``);
    await queryRunner.query(`DROP INDEX \`IDX_finishes_name\` ON \`finishes\``);
    await queryRunner.query(`DROP INDEX \`IDX_levels_name\` ON \`levels\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_categories_name\` ON \`categories\``,
    );
    await queryRunner.query(`DROP INDEX \`IDX_users_email\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_users_externalId\` ON \`users\``);
    await queryRunner.query(`DROP INDEX \`IDX_roles_name\` ON \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_permissions_name\` ON \`permissions\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_suppliers\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`suppliers\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`finishes\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`levels\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deleted_at\``);
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`deleted_at\``);
    await queryRunner.query(
      `ALTER TABLE \`permissions\` DROP COLUMN \`deleted_at\``,
    );
  }
}
