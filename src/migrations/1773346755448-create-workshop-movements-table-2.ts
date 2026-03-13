import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkshopMovementsTable21773346755448 implements MigrationInterface {
  name = 'CreateWorkshopMovementsTable21773346755448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`workshop_tool_movements\` (\`id\` varchar(255) NOT NULL, \`toolId\` varchar(255) NOT NULL, \`previousStatus\` enum ('available', 'in_use', 'in_repair', 'retired') NOT NULL, \`newStatus\` enum ('available', 'in_use', 'in_repair', 'retired') NOT NULL, \`jobId\` varchar(255) NULL, \`notes\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_wtm_createdAt\` (\`createdAt\`), INDEX \`IDX_wtm_toolId\` (\`toolId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`workshop_material_movements\` (\`id\` varchar(255) NOT NULL, \`materialId\` varchar(255) NOT NULL, \`delta\` decimal(12,3) NOT NULL, \`reason\` enum ('compra', 'uso_job', 'devolucion', 'ajuste_inventario', 'otro') NOT NULL, \`jobId\` varchar(255) NULL, \`notes\` text NULL, \`createdBy\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_wmm_createdAt\` (\`createdAt\`), INDEX \`IDX_wmm_materialId\` (\`materialId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_wmm_materialId\` ON \`workshop_material_movements\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_wmm_createdAt\` ON \`workshop_material_movements\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_material_movements\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_wtm_toolId\` ON \`workshop_tool_movements\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_wtm_createdAt\` ON \`workshop_tool_movements\``,
    );
    await queryRunner.query(`DROP TABLE \`workshop_tool_movements\``);
  }
}
