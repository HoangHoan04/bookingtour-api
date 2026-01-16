import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1768541012871 implements MigrationInterface {
    name = 'MigrationName1768541012871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "emailNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "pushNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "smsNotifications" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "promotionNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "bookingNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "recommendationNotifications" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_264845303e37b5566397a6708fa"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "REL_264845303e37b5566397a6708f"`);
        await queryRunner.query(`ALTER TABLE "tour_details" DROP CONSTRAINT "FK_30994aed327aea1b5f0c2106a2b"`);
        await queryRunner.query(`ALTER TABLE "tour_details" DROP CONSTRAINT "REL_30994aed327aea1b5f0c2106a2"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_264845303e37b5566397a6708fa" FOREIGN KEY ("tourDetailId") REFERENCES "tour_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_details" ADD CONSTRAINT "FK_30994aed327aea1b5f0c2106a2b" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tour_details" DROP CONSTRAINT "FK_30994aed327aea1b5f0c2106a2b"`);
        await queryRunner.query(`ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_264845303e37b5566397a6708fa"`);
        await queryRunner.query(`ALTER TABLE "tour_details" ADD CONSTRAINT "REL_30994aed327aea1b5f0c2106a2" UNIQUE ("tourId")`);
        await queryRunner.query(`ALTER TABLE "tour_details" ADD CONSTRAINT "FK_30994aed327aea1b5f0c2106a2b" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "REL_264845303e37b5566397a6708f" UNIQUE ("tourDetailId")`);
        await queryRunner.query(`ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_264845303e37b5566397a6708fa" FOREIGN KEY ("tourDetailId") REFERENCES "tour_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "recommendationNotifications" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "bookingNotifications" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "promotionNotifications" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "smsNotifications" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "pushNotifications" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ALTER COLUMN "emailNotifications" SET DEFAULT true`);
    }

}
