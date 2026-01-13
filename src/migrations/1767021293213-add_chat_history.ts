import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatHistory1767021293213 implements MigrationInterface {
    name = 'AddChatHistory1767021293213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "question" text NOT NULL, "answer" text NOT NULL, CONSTRAINT "PK_cf76a7693b0b075dd86ea05f21d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "chat_history"`);
    }

}
