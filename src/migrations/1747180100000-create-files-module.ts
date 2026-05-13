import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilesModule1747180100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE folders (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parentId VARCHAR(36) NULL,
        organizationId VARCHAR(36) NOT NULL,
        createdByUserId VARCHAR(36) NOT NULL,
        createdAt TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP NOT NULL,
        INDEX IDX_folders_org (organizationId),
        INDEX IDX_folders_parent (parentId),
        CONSTRAINT FK_folders_parent FOREIGN KEY (parentId) REFERENCES folders(id) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE file_records (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        storageKey VARCHAR(512) NOT NULL,
        mimeType VARCHAR(128) NOT NULL,
        sizeBytes BIGINT NOT NULL,
        folderId VARCHAR(36) NOT NULL,
        organizationId VARCHAR(36) NOT NULL,
        createdByUserId VARCHAR(36) NOT NULL,
        deletedAt TIMESTAMP NULL,
        createdAt TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP NOT NULL,
        INDEX IDX_file_records_org_folder (organizationId, folderId),
        CONSTRAINT FK_file_records_folder FOREIGN KEY (folderId) REFERENCES folders(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE file_tags (
        id VARCHAR(36) NOT NULL PRIMARY KEY,
        fileId VARCHAR(36) NOT NULL,
        tag VARCHAR(100) NOT NULL,
        INDEX IDX_file_tags_tag (tag),
        UNIQUE IDX_file_tags_unique (fileId, tag),
        CONSTRAINT FK_file_tags_file FOREIGN KEY (fileId) REFERENCES file_records(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE file_tags`);
    await queryRunner.query(`DROP TABLE file_records`);
    await queryRunner.query(`DROP TABLE folders`);
  }
}
