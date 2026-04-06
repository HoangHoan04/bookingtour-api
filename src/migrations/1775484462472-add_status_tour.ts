import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusTour1775484462472 implements MigrationInterface {
    name = 'AddStatusTour1775484462472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "action_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "createdById" uuid, "createdByName" character varying(250) NOT NULL, "createdNote" character varying(500), "description" text NOT NULL, "dataOld" text, "dataNew" text, "type" character varying NOT NULL, "functionType" character varying(250) NOT NULL, "functionId" uuid, CONSTRAINT "PK_cc15d2a348eaf2e1e153055380c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "emailNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "pushNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "smsNotifications" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "promotionNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "bookingNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "recommendationNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "recommendationNotifications" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "bookingNotifications" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "promotionNotifications" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "smsNotifications" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "pushNotifications" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "emailNotifications" SET DEFAULT true`);
        await queryRunner.query(`DROP TABLE "action_logs"`);
    }

}
