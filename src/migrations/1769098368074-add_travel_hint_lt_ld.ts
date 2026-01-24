import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTravelHintLtLd1769098368074 implements MigrationInterface {
    name = 'AddTravelHintLtLd1769098368074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "travel_hint" ADD "latitude" numeric(10,7)`);
        await queryRunner.query(`ALTER TABLE "travel_hint" ADD "longitude" numeric(10,7)`);
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
        await queryRunner.query(`ALTER TABLE "travel_hint" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "travel_hint" DROP COLUMN "latitude"`);
    }

}
