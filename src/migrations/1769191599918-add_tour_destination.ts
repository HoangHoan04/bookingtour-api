import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTourDestination1769191599918 implements MigrationInterface {
  name = 'AddTourDestination1769191599918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop foreign key constraints trước
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP CONSTRAINT "FK_ba6c822f3bacb20d662cdb65b57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP CONSTRAINT "FK_fd78ecc761e62b02ab8053ea605"`,
    );

    // 2. Drop old composite primary key
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP CONSTRAINT "PK_8c4c9903aa85d06b7f808aba7e8"`,
    );

    // 3. Add id column
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );

    // 4. Set id làm primary key (CHỈ id)
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD CONSTRAINT "PK_144dfa7b85c2f7157cdc6819a8c" PRIMARY KEY ("id")`,
    );

    // 5. Bây giờ mới alter tourId và destinationId thành nullable (không còn trong PK)
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ALTER COLUMN "tourId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ALTER COLUMN "destinationId" DROP NOT NULL`,
    );

    // 6. Add các cột từ BaseEntity
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD "createdBy" character varying(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD "updatedAt" TIMESTAMP DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD "updatedBy" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD "isDeleted" boolean NOT NULL DEFAULT false`,
    );

    // 7. Update createdAt default
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );

    // 8. Update notification_settings defaults
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

    // 9. Update reviews default
    await queryRunner.query(
      `ALTER TABLE "reviews" ALTER COLUMN "isVerified" SET DEFAULT '0'`,
    );

    // 10. Add lại foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD CONSTRAINT "FK_ba6c822f3bacb20d662cdb65b57" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD CONSTRAINT "FK_fd78ecc761e62b02ab8053ea605" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse order
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP CONSTRAINT "FK_fd78ecc761e62b02ab8053ea605"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP CONSTRAINT "FK_ba6c822f3bacb20d662cdb65b57"`,
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
      `ALTER TABLE "tour_destinations" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP COLUMN "isDeleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP COLUMN "updatedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP COLUMN "createdBy"`,
    );

    // Set lại NOT NULL cho tourId và destinationId
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ALTER COLUMN "destinationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ALTER COLUMN "tourId" SET NOT NULL`,
    );

    // Drop new PK
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" DROP CONSTRAINT "PK_144dfa7b85c2f7157cdc6819a8c"`,
    );

    // Restore old composite PK
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD CONSTRAINT "PK_8c4c9903aa85d06b7f808aba7e8" PRIMARY KEY ("tourId", "destinationId")`,
    );

    // Drop id column
    await queryRunner.query(`ALTER TABLE "tour_destinations" DROP COLUMN "id"`);

    // Restore FK with CASCADE
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD CONSTRAINT "FK_fd78ecc761e62b02ab8053ea605" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_destinations" ADD CONSTRAINT "FK_ba6c822f3bacb20d662cdb65b57" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
