import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTravelHint1769098198294 implements MigrationInterface {
  name = 'AddTravelHint1769098198294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "travel_hint" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "month" integer NOT NULL, "locationName" character varying(255) NOT NULL, "description" text, "reason" text, "type" character varying(36) NOT NULL, "tags" text, "country" character varying(150), "city" character varying(150), CONSTRAINT "PK_51207f7a2e977fad25d740aaf2a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD "travelHintId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "emailNotifications" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "pushNotifications" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "smsNotifications" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "promotionNotifications" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "bookingNotifications" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "recommendationNotifications" SET DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD CONSTRAINT "FK_6e88e20d04b8d290eb187d601fa" FOREIGN KEY ("travelHintId") REFERENCES "travel_hint"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "FK_6e88e20d04b8d290eb187d601fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "recommendationNotifications" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "bookingNotifications" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "promotionNotifications" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "smsNotifications" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "pushNotifications" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ALTER COLUMN "emailNotifications" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "UQ_6e88e20d04b8d290eb187d601fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP COLUMN "travelHintId"`,
    );
    await queryRunner.query(`DROP TABLE "travel_hint"`);
  }
}
