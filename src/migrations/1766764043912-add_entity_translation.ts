import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEntityTranslation1766764043912 implements MigrationInterface {
  name = 'AddEntityTranslation1766764043912';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "key" character varying(255) NOT NULL, "en" text, "vi" text, CONSTRAINT "UQ_53f09a1414bace37a1b821bf1b8" UNIQUE ("key"), CONSTRAINT "PK_aca248c72ae1fb2390f1bf4cd87" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "translations"`);
  }
}
