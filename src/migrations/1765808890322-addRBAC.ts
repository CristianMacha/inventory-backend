import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRBAC1765808890322 implements MigrationInterface {
  name = 'AddRBAC1765808890322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`permissions\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles_permissions\` (\`role_id\` varchar(36) NOT NULL, \`permission_id\` varchar(36) NOT NULL, INDEX \`IDX_7d2dad9f14eddeb09c256fea71\` (\`role_id\`), INDEX \`IDX_337aa8dba227a1fe6b73998307\` (\`permission_id\`), PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_roles\` (\`user_id\` varchar(36) NOT NULL, \`role_id\` varchar(36) NOT NULL, INDEX \`IDX_e4435209df12bc1f001e536017\` (\`user_id\`), INDEX \`IDX_1cf664021f00b9cc1ff95e17de\` (\`role_id\`), PRIMARY KEY (\`user_id\`, \`role_id\`)) ENGINE=InnoDB`,
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
      `DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`permissions\``);
  }
}
