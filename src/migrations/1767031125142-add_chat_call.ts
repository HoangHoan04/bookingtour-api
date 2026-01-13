import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatCall1767031125142 implements MigrationInterface {
    name = 'AddChatCall1767031125142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "chatRoomId" uuid NOT NULL, "senderId" uuid NOT NULL, "content" text, "messageType" character varying(20) NOT NULL DEFAULT 'TEXT', "attachments" jsonb, "replyToMessageId" uuid, "isEdited" boolean NOT NULL DEFAULT false, "editedAt" TIMESTAMP, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_room_members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "chatRoomId" uuid NOT NULL, "userId" uuid NOT NULL, "role" character varying(20) NOT NULL DEFAULT 'MEMBER', "lastReadAt" TIMESTAMP, "isMuted" boolean NOT NULL DEFAULT false, "hasLeft" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_736e2c819bfb5e5ab96ce8b43c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(255), "type" character varying(20) NOT NULL DEFAULT 'DIRECT', "avatarUrl" text, "createdByUserId" uuid NOT NULL, CONSTRAINT "PK_c69082bd83bffeb71b0f455bd59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "call_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "chatRoomId" uuid NOT NULL, "callerId" uuid NOT NULL, "callType" character varying(20) NOT NULL, "status" character varying(20) NOT NULL, "startedAt" TIMESTAMP NOT NULL, "endedAt" TIMESTAMP, "duration" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_aa08476bcc13bfdf394261761e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "call_participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "callLogId" uuid NOT NULL, "userId" uuid NOT NULL, "joinedAt" TIMESTAMP, "leftAt" TIMESTAMP, "status" character varying(20) NOT NULL, CONSTRAINT "PK_70fa47f8dcabf5603fee79564dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_c7fd35e9a8cb40b91bb014441e2" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_fc6b58e41e9a871dacbe9077def" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_7f14f98223ed064c8904067dce1" FOREIGN KEY ("replyToMessageId") REFERENCES "chat_messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room_members" ADD CONSTRAINT "FK_42fe809da8399af5abfbde939cb" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room_members" ADD CONSTRAINT "FK_66ac0be88e0b28fec63fc7a8b96" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_rooms" ADD CONSTRAINT "FK_32508ce0ddea4f7ae9ac7e8f03a" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_logs" ADD CONSTRAINT "FK_c3043f0417cf9d81844eb1815f8" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_logs" ADD CONSTRAINT "FK_be007a428c3a75aaf63562421fe" FOREIGN KEY ("callerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_participants" ADD CONSTRAINT "FK_d780646ef258a31dbd857c40962" FOREIGN KEY ("callLogId") REFERENCES "call_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "call_participants" ADD CONSTRAINT "FK_585dbc053038a753134270af8e1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "call_participants" DROP CONSTRAINT "FK_585dbc053038a753134270af8e1"`);
        await queryRunner.query(`ALTER TABLE "call_participants" DROP CONSTRAINT "FK_d780646ef258a31dbd857c40962"`);
        await queryRunner.query(`ALTER TABLE "call_logs" DROP CONSTRAINT "FK_be007a428c3a75aaf63562421fe"`);
        await queryRunner.query(`ALTER TABLE "call_logs" DROP CONSTRAINT "FK_c3043f0417cf9d81844eb1815f8"`);
        await queryRunner.query(`ALTER TABLE "chat_rooms" DROP CONSTRAINT "FK_32508ce0ddea4f7ae9ac7e8f03a"`);
        await queryRunner.query(`ALTER TABLE "chat_room_members" DROP CONSTRAINT "FK_66ac0be88e0b28fec63fc7a8b96"`);
        await queryRunner.query(`ALTER TABLE "chat_room_members" DROP CONSTRAINT "FK_42fe809da8399af5abfbde939cb"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_7f14f98223ed064c8904067dce1"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_fc6b58e41e9a871dacbe9077def"`);
        await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_c7fd35e9a8cb40b91bb014441e2"`);
        await queryRunner.query(`DROP TABLE "call_participants"`);
        await queryRunner.query(`DROP TABLE "call_logs"`);
        await queryRunner.query(`DROP TABLE "chat_rooms"`);
        await queryRunner.query(`DROP TABLE "chat_room_members"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
    }

}
