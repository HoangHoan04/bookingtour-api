import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDestination1769153153379 implements MigrationInterface {
    name = 'ChangeDestination1769153153379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "destinations" DROP COLUMN "touringCount"`);
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
        await queryRunner.query(`ALTER TABLE "destinations" ADD "touringCount" integer NOT NULL DEFAULT '0'`);
    }

}
