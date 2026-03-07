import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReturningSlabStatusColumn1772831002351 implements MigrationInterface {
    name = 'AddReturningSlabStatusColumn1772831002351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`slabs\` CHANGE \`status\` \`status\` enum ('AVAILABLE', 'RESERVED', 'SOLD', 'RETURNING', 'RETURNED') NOT NULL DEFAULT 'AVAILABLE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`slabs\` CHANGE \`status\` \`status\` enum ('AVAILABLE', 'RESERVED', 'SOLD', 'RETURNED') NOT NULL DEFAULT 'AVAILABLE'`);
    }

}
