import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDb1768730183166 implements MigrationInterface {
    name = 'ChangeDb1768730183166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN "site"`);
        await queryRunner.query(`ALTER TABLE "news" DROP COLUMN "site"`);
        await queryRunner.query(`COMMENT ON COLUMN "news"."titleVI" IS 'Tiêu đề tin tức '`);
        await queryRunner.query(`COMMENT ON COLUMN "news"."titleEN" IS 'Tiêu đề tin tức '`);
        await queryRunner.query(`COMMENT ON COLUMN "news"."contentVI" IS 'Nội dung tin tức '`);
        await queryRunner.query(`COMMENT ON COLUMN "news"."contentEN" IS 'Nội dung tin tức '`);
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
        await queryRunner.query(`COMMENT ON COLUMN "news"."contentEN" IS 'Nội dung tin tức bằng tiếng Anh'`);
        await queryRunner.query(`COMMENT ON COLUMN "news"."contentVI" IS 'Nội dung tin tức bằng tiếng Việt'`);
        await queryRunner.query(`COMMENT ON COLUMN "news"."titleEN" IS 'Tiêu đề tin tức bằng tiếng Việt'`);
        await queryRunner.query(`COMMENT ON COLUMN "news"."titleVI" IS 'Tiêu đề tin tức bằng tiếng Việt'`);
        await queryRunner.query(`ALTER TABLE "news" ADD "site" character varying(255) NOT NULL DEFAULT 'CUSTOMER'`);
        await queryRunner.query(`ALTER TABLE "banners" ADD "site" character varying(40)`);
    }

}
