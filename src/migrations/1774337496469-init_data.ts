import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1774337496469 implements MigrationInterface {
  name = 'InitData1774337496469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "titleVI"`);
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "titleEN"`);
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "contentVI"`);
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "contentEN"`);
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "url"`);
    await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN "titleEn"`);
    await queryRunner.query(
      `ALTER TABLE "news" ADD "title" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "news"."title" IS 'Tiêu đề tin tức '`,
    );
    await queryRunner.query(`ALTER TABLE "news" ADD "content" text NOT NULL`);
    await queryRunner.query(
      `COMMENT ON COLUMN "news"."content" IS 'Nội dung tin tức '`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `COMMENT ON COLUMN "news"."content" IS 'Nội dung tin tức '`,
    );
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "content"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "news"."title" IS 'Tiêu đề tin tức '`,
    );
    await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "banners" ADD "titleEn" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "news" ADD "url" character varying`);
    await queryRunner.query(`ALTER TABLE "news" ADD "contentEN" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "news" ADD "contentVI" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "news" ADD "titleEN" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD "titleVI" character varying(255) NOT NULL`,
    );
  }
}
