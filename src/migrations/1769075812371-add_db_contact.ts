import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDbContact1769075812371 implements MigrationInterface {
  name = 'AddDbContact1769075812371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_NEWSLETTER_EMAIL"`);
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
      `ALTER TABLE "newsletter" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter" ALTER COLUMN "subscribedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7e3d2b10221e8b16279dac5831" ON "newsletter" ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e3d2b10221e8b16279dac5831"`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter" ALTER COLUMN "subscribedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter" ALTER COLUMN "updatedAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "newsletter" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
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
      `CREATE UNIQUE INDEX "IDX_NEWSLETTER_EMAIL" ON "newsletter" ("email") `,
    );
  }
}
