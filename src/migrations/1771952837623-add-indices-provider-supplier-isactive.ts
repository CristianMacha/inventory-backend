import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndicesProviderSupplierIsactive1771952837623 implements MigrationInterface {
  name = 'AddIndicesProviderSupplierIsactive1771952837623';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX \`IDX_users_provider_externalId\` ON \`users\` (\`provider\`, \`external_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_suppliers_isActive\` ON \`suppliers\` (\`isActive\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_suppliers_isActive\` ON \`suppliers\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_users_provider_externalId\` ON \`users\``,
    );
  }
}
