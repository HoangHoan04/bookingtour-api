import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTourGuide1769091034297 implements MigrationInterface {
  name = 'AddTourGuide1769091034297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tour_guides" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "phone" character varying(25) NOT NULL, "slug" character varying(200) NOT NULL, "email" character varying(250) NOT NULL, "address" character varying(250), "gender" character varying(10), "birthday" TIMESTAMP WITH TIME ZONE NOT NULL, "nationality" character varying(50), "identityCard" character varying(12), "passportNumber" character varying(20), "shortBio" character varying(500), "bio" text, "languages" text, "specialties" text, "yearsOfExperience" integer DEFAULT '0', "licenseNumber" character varying(50), "licenseIssuedDate" TIMESTAMP WITH TIME ZONE, "licenseExpiryDate" TIMESTAMP WITH TIME ZONE, "licenseIssuedBy" character varying(200), "averageRating" numeric(3,2) NOT NULL DEFAULT '0', "totalReviews" integer NOT NULL DEFAULT '0', "totalToursCompleted" integer NOT NULL DEFAULT '0', "status" character varying(36) NOT NULL DEFAULT 'PENDING', "description" text, "baseSalary" numeric(15,2), "commissionRate" numeric(5,2) DEFAULT '0', "startDate" TIMESTAMP WITH TIME ZONE, "endDate" TIMESTAMP WITH TIME ZONE, "isAvailable" boolean NOT NULL DEFAULT true, "bankAccountNumber" character varying(50), "bankName" character varying(100), "bankAccountName" character varying(100), CONSTRAINT "UQ_7d5d8f8758fe6b75eb0ea8e6d73" UNIQUE ("code"), CONSTRAINT "UQ_c72085e681a71f5336e1434d22f" UNIQUE ("slug"), CONSTRAINT "UQ_739a7f23b7c86a908329f858368" UNIQUE ("email"), CONSTRAINT "UQ_1cb7c831750d4378a66126402bc" UNIQUE ("identityCard"), CONSTRAINT "UQ_eaba949e20c7a1b3e84f96fa381" UNIQUE ("passportNumber"), CONSTRAINT "UQ_24052cfc94558c479c2ce4e13cb" UNIQUE ("licenseNumber"), CONSTRAINT "PK_e86bdf0d1c89c8f549523fa1070" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "tourGuideId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_f0de33fc3ac11c639cbf862c212" UNIQUE ("tourGuideId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_details" ADD "tourGuideId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_details" ADD CONSTRAINT "UQ_dd1b867580e7adf4398e598096a" UNIQUE ("tourGuideId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD "tourGuideId" uuid`,
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
      `ALTER TABLE "users" ADD CONSTRAINT "FK_f0de33fc3ac11c639cbf862c212" FOREIGN KEY ("tourGuideId") REFERENCES "tour_guides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_responses" ADD CONSTRAINT "FK_472b9ba33a85585d666a0154c38" FOREIGN KEY ("responderId") REFERENCES "tour_guides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_details" ADD CONSTRAINT "FK_dd1b867580e7adf4398e598096a" FOREIGN KEY ("tourGuideId") REFERENCES "tour_guides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD CONSTRAINT "FK_33602dcdab1d0baa76ad9882e8c" FOREIGN KEY ("tourGuideId") REFERENCES "tour_guides"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "FK_33602dcdab1d0baa76ad9882e8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_details" DROP CONSTRAINT "FK_dd1b867580e7adf4398e598096a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_responses" DROP CONSTRAINT "FK_472b9ba33a85585d666a0154c38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_f0de33fc3ac11c639cbf862c212"`,
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
      `ALTER TABLE "file_archive" DROP COLUMN "tourGuideId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_details" DROP CONSTRAINT "UQ_dd1b867580e7adf4398e598096a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_details" DROP COLUMN "tourGuideId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_f0de33fc3ac11c639cbf862c212"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tourGuideId"`);
    await queryRunner.query(`DROP TABLE "tour_guides"`);
  }
}
