import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixLogin1768558569531 implements MigrationInterface {
  name = 'FixLogin1768558569531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "banners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "url" character varying, "title" character varying NOT NULL, "titleEn" character varying, "displayOrder" integer DEFAULT '0', "isVisible" boolean NOT NULL DEFAULT true, "effectiveStartDate" TIMESTAMP WITH TIME ZONE, "effectiveEndDate" TIMESTAMP WITH TIME ZONE, "status" character varying, "type" character varying(40), "site" character varying(40), CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(10) NOT NULL, "titleVI" character varying(255) NOT NULL, "titleEN" character varying(255) NOT NULL, "contentVI" text NOT NULL, "contentEN" text NOT NULL, "url" character varying, "site" character varying(255) NOT NULL DEFAULT 'CUSTOMER', "type" character varying(255) NOT NULL DEFAULT 'NEWS', "effectiveStartDate" TIMESTAMP WITH TIME ZONE, "effectiveEndDate" TIMESTAMP WITH TIME ZONE, "status" character varying(25) NOT NULL DEFAULT 'FRESHLY_CREATED', "rank" integer, "isVisible" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_0f77543ed4e5e510eae9e5c19be" UNIQUE ("code"), CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id")); COMMENT ON COLUMN "news"."titleVI" IS 'Tiêu đề tin tức bằng tiếng Việt'; COMMENT ON COLUMN "news"."titleEN" IS 'Tiêu đề tin tức bằng tiếng Việt'; COMMENT ON COLUMN "news"."contentVI" IS 'Nội dung tin tức bằng tiếng Việt'; COMMENT ON COLUMN "news"."contentEN" IS 'Nội dung tin tức bằng tiếng Anh'; COMMENT ON COLUMN "news"."url" IS 'Link bài viết'; COMMENT ON COLUMN "news"."site" IS 'Trang web mà bài viết được đăng'; COMMENT ON COLUMN "news"."type" IS 'Loại tin tức'; COMMENT ON COLUMN "news"."effectiveStartDate" IS 'Ngày bắt đầu hiệu lực của bài viết'; COMMENT ON COLUMN "news"."effectiveEndDate" IS 'Ngày kết thúc hiệu lực của bài viết'; COMMENT ON COLUMN "news"."status" IS 'Trạng thái bài viết'; COMMENT ON COLUMN "news"."rank" IS 'Xếp hạng nổi bật bài viết'; COMMENT ON COLUMN "news"."isVisible" IS 'Trạng thái hiển thị của tin tức'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "icon" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "color" character varying(50)`,
    );
    await queryRunner.query(`ALTER TABLE "file_archive" ADD "newId" uuid`);
    await queryRunner.query(`ALTER TABLE "file_archive" ADD "bannerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD CONSTRAINT "UQ_84d4cafda99986d7d21f981118c" UNIQUE ("bannerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "notificationType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "notificationType" SET DEFAULT 'general'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "priority" SET DEFAULT 'normal'`,
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
      `ALTER TABLE "customers" ALTER COLUMN "address" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "gender" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "nationality" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "identityCard" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD CONSTRAINT "FK_84e0a3220d17b30434b043cb249" FOREIGN KEY ("newId") REFERENCES "news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD CONSTRAINT "FK_84d4cafda99986d7d21f981118c" FOREIGN KEY ("bannerId") REFERENCES "banners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "FK_84d4cafda99986d7d21f981118c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "FK_84e0a3220d17b30434b043cb249"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "identityCard" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "nationality" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "gender" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customers" ALTER COLUMN "address" SET NOT NULL`,
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
      `ALTER TABLE "notifications" ALTER COLUMN "priority" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "notificationType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "notificationType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "UQ_84d4cafda99986d7d21f981118c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP COLUMN "bannerId"`,
    );
    await queryRunner.query(`ALTER TABLE "file_archive" DROP COLUMN "newId"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "color"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "icon"`);
    await queryRunner.query(`DROP TABLE "news"`);
    await queryRunner.query(`DROP TABLE "banners"`);
  }
}
