import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlugToProducts1774275801955 implements MigrationInterface {
  name = 'AddSlugToProducts1774275801955';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add slug column nullable to allow populating existing rows
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`slug\` varchar(255) NULL`,
    );

    // Populate slug from existing names (lowercase, spaces to dashes, strip special chars)
    await queryRunner.query(`
      UPDATE \`products\`
      SET \`slug\` = LOWER(REGEXP_REPLACE(TRIM(\`name\`), '[^a-zA-Z0-9]+', '-'))
    `);

    // Make NOT NULL and add unique index
    await queryRunner.query(
      `ALTER TABLE \`products\` MODIFY \`slug\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_464f927ae360106b783ed0b410\` (\`slug\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP INDEX \`IDX_464f927ae360106b783ed0b410\``,
    );
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`slug\``);
  }
}
