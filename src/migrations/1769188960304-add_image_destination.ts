import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageDestination1769188960304 implements MigrationInterface {
  name = 'AddImageDestination1769188960304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "destinations" DROP COLUMN "imageUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD "destinationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD CONSTRAINT "UQ_3940732fa6499296a2006a5caf9" UNIQUE ("destinationId")`,
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
      `ALTER TABLE "file_archive" ADD CONSTRAINT "FK_3940732fa6499296a2006a5caf9" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "FK_3940732fa6499296a2006a5caf9"`,
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
      `ALTER TABLE "file_archive" DROP CONSTRAINT "UQ_3940732fa6499296a2006a5caf9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP COLUMN "destinationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "destinations" ADD "imageUrl" character varying(500)`,
    );
  }
}
