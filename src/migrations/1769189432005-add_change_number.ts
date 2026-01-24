import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChangeNumber1769189432005 implements MigrationInterface {
  name = 'AddChangeNumber1769189432005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "destinations" ALTER COLUMN "latitude" TYPE numeric(12,8)`,
    );
    await queryRunner.query(
      `ALTER TABLE "destinations" ALTER COLUMN "longitude" TYPE numeric(12,8)`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT '0'`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "destinations" ALTER COLUMN "longitude" TYPE numeric(11,8)`,
    );
    await queryRunner.query(
      `ALTER TABLE "destinations" ALTER COLUMN "latitude" TYPE numeric(10,8)`,
    );
  }
}
