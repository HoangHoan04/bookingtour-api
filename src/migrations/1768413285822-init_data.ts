import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitData1768413285822 implements MigrationInterface {
  name = 'InitData1768413285822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "key" character varying(255) NOT NULL, "en" text, "vi" text, CONSTRAINT "UQ_53f09a1414bace37a1b821bf1b8" UNIQUE ("key"), CONSTRAINT "PK_aca248c72ae1fb2390f1bf4cd87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "authorId" uuid NOT NULL, "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "excerpt" character varying(500), "content" text NOT NULL, "featuredImage" character varying(500), "category" character varying(50), "tags" json, "viewCount" integer NOT NULL DEFAULT '0', "likeCount" integer NOT NULL DEFAULT '0', "status" character varying(50) NOT NULL, "seoTitle" character varying(255), "seoDescription" character varying(500), "publishedAt" TIMESTAMP, CONSTRAINT "UQ_5b2818a2c45c3edb9991b1c7a51" UNIQUE ("slug"), CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "postId" uuid NOT NULL, "customerId" uuid NOT NULL, "parentId" uuid, "content" character varying(500) NOT NULL, "status" character varying(50) NOT NULL, CONSTRAINT "PK_b478aaeecf38441a25739aa9610" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "destinations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(100) NOT NULL, "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "country" character varying(100), "region" character varying(100), "description" text, "imageUrl" character varying(500), "latitude" numeric(10,8), "longitude" numeric(11,8), "bestTimeToVisit" character varying(100), "averageTemperature" character varying(100), "popularActivities" json, "touringCount" integer NOT NULL DEFAULT '0', "viewCount" integer NOT NULL DEFAULT '0', "rating" integer, "status" character varying(50) NOT NULL, CONSTRAINT "UQ_30864aeaf404f4a6d3f816bd8c5" UNIQUE ("slug"), CONSTRAINT "PK_69c5e8db964dcb83d3a0640f3c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "faqs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "question" character varying(255) NOT NULL, "answer" text NOT NULL, "category" character varying(100), "displayOrder" integer, "viewCount" integer NOT NULL DEFAULT '0', "isHelpful" integer NOT NULL DEFAULT '0', "tags" json, "status" character varying(50) NOT NULL, CONSTRAINT "PK_2ddf4f2c910f8e8fa2663a67bf0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "customerId" uuid NOT NULL, "title" character varying(255) NOT NULL, "content" text, "notificationType" character varying(50), "relatedEntity" character varying(50), "relatedId" uuid, "isRead" boolean NOT NULL DEFAULT '0', "readAt" TIMESTAMP, "priority" character varying(20) NOT NULL, "actionUrl" character varying(500), "expiresAt" TIMESTAMP, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "customerId" uuid NOT NULL, "emailNotifications" boolean NOT NULL DEFAULT '1', "pushNotifications" boolean NOT NULL DEFAULT '1', "smsNotifications" boolean NOT NULL DEFAULT '0', "promotionNotifications" boolean NOT NULL DEFAULT '1', "bookingNotifications" boolean NOT NULL DEFAULT '1', "recommendationNotifications" boolean NOT NULL DEFAULT '1', CONSTRAINT "UQ_8b2f5487bc764dacc3a82570f93" UNIQUE ("customerId"), CONSTRAINT "REL_8b2f5487bc764dacc3a82570f9" UNIQUE ("customerId"), CONSTRAINT "PK_d131abd7996c475ef768d4559ba" PRIMARY KEY ("id")); COMMENT ON COLUMN "notification_settings"."customerId" IS 'Liên kết 1-1 với users'; COMMENT ON COLUMN "notification_settings"."emailNotifications" IS 'Nhận thông báo qua email'; COMMENT ON COLUMN "notification_settings"."pushNotifications" IS 'Nhận push notification'; COMMENT ON COLUMN "notification_settings"."smsNotifications" IS 'Nhận thông báo qua SMS'; COMMENT ON COLUMN "notification_settings"."promotionNotifications" IS 'Nhận thông báo khuyến mãi'; COMMENT ON COLUMN "notification_settings"."bookingNotifications" IS 'Nhận thông báo đặt tour'; COMMENT ON COLUMN "notification_settings"."recommendationNotifications" IS 'Nhận gợi ý tour'`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "roleId" uuid NOT NULL, "assignedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::date, "assignedById" uuid, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "permissions" json, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "username" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "customerId" uuid, "isActive" boolean NOT NULL DEFAULT true, "isAdmin" boolean NOT NULL DEFAULT false, "refreshToken" text, "lastLogin" TIMESTAMP, "zaloId" character varying, "googleId" character varying, "facebookId" character varying(100), "loginProvider" character varying, "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_f9740e1e654a5daddb82c60bd75" UNIQUE ("facebookId"), CONSTRAINT "REL_c6c520dfb9a4d6dd749e73b13d" UNIQUE ("customerId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50) NOT NULL, "name" character varying(30) NOT NULL, "phone" character varying(25) NOT NULL, "email" character varying(250) NOT NULL, "address" character varying(250) NOT NULL, "gender" character varying(10) NOT NULL, "birthday" TIMESTAMP WITH TIME ZONE NOT NULL, "nationality" character varying(12) NOT NULL, "identityCard" character varying(12) NOT NULL, "passportNumber" character varying(20), "status" character varying(36), "description" text, CONSTRAINT "UQ_f2eee14aa1fe3e956fe193c142f" UNIQUE ("code"), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "UQ_59c76c70e94af1ee54fdebaa9f8" UNIQUE ("identityCard"), CONSTRAINT "UQ_fc562de70ec32acaaab3ab3c34c" UNIQUE ("passportNumber"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "review_responses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "reviewId" uuid NOT NULL, "responderId" uuid NOT NULL, "content" text NOT NULL, CONSTRAINT "PK_22e536591de245e6d51965ea5a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "tourId" uuid NOT NULL, "customerId" uuid NOT NULL, "bookingId" uuid NOT NULL, "reviewerName" character varying(100) NOT NULL, "content" text NOT NULL, "rating" integer NOT NULL, "isVerified" boolean NOT NULL DEFAULT '0', "likes" integer NOT NULL DEFAULT '0', "status" character varying(50) NOT NULL, "rejectionReason" text, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50), "title" character varying(100) NOT NULL, "slug" character varying(100) NOT NULL, "location" character varying(255) NOT NULL, "durations" character varying(50) NOT NULL, "shortDescription" text NOT NULL, "longDescription" text, "highlights" character varying(255), "included" text, "excluded" text, "rating" double precision NOT NULL DEFAULT '0', "reviewCount" integer NOT NULL DEFAULT '0', "viewCount" integer NOT NULL DEFAULT '0', "bookingCount" integer NOT NULL DEFAULT '0', "category" character varying(100), "tags" text, "status" character varying(50) NOT NULL, CONSTRAINT "UQ_392e71516528220885d618f4e0b" UNIQUE ("code"), CONSTRAINT "UQ_b0d61c620db1f027c3adf5afd46" UNIQUE ("title"), CONSTRAINT "UQ_233c6bf8b7c2c897c6eed5373a6" UNIQUE ("slug"), CONSTRAINT "PK_2202ba445792c1ad0edf2de8de2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tour_itineraries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "tourDetailId" uuid NOT NULL, "code" character varying(50), "title" character varying(255) NOT NULL, "dayNumber" integer NOT NULL, "content" text NOT NULL, "activities" text NOT NULL, "meals" text NOT NULL, "accommodation" character varying(255) NOT NULL, CONSTRAINT "UQ_f687ec580899ae81624d3a23156" UNIQUE ("code"), CONSTRAINT "REL_24c9104671ef73ea5e9aa36fe5" UNIQUE ("tourDetailId"), CONSTRAINT "PK_74586817c106b4e2b67e473ad10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tour_prices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50), "priceType" character varying(100) NOT NULL, "price" numeric(15,2) NOT NULL, "currency" character varying(255) NOT NULL, "tourDetailId" uuid, CONSTRAINT "UQ_1726732f891a39cf7556e4fb510" UNIQUE ("code"), CONSTRAINT "REL_264845303e37b5566397a6708f" UNIQUE ("tourDetailId"), CONSTRAINT "PK_fa3b74cad6c6c372f1d9a8ff96c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tour_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "tourId" uuid, "code" character varying(50), "startDay" TIMESTAMP NOT NULL, "endDay" TIMESTAMP NOT NULL, "startLocation" character varying(255) NOT NULL, "capacity" integer NOT NULL, "remainingSeats" integer NOT NULL, "status" character varying(50) NOT NULL, CONSTRAINT "UQ_3e91f83efc6a6e587929f7ecce0" UNIQUE ("code"), CONSTRAINT "REL_30994aed327aea1b5f0c2106a2" UNIQUE ("tourId"), CONSTRAINT "PK_4fbc4688163d419042c12d76c7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "price" numeric(15,2) NOT NULL, "bookingId" uuid NOT NULL, "tourId" uuid NOT NULL, "quantity" integer NOT NULL, "subtotal" numeric(15,2) NOT NULL, "passengerInfo" json, "status" character varying(50) NOT NULL, "tourDetailId" uuid NOT NULL, "tourPriceId" uuid, CONSTRAINT "PK_53e6fd8cc006caf8abe22700012" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50), "contactFullname" character varying(100) NOT NULL, "contactEmail" character varying(100) NOT NULL, "contactPhone" character varying(255) NOT NULL, "contactAddress" character varying(250) NOT NULL, "note" text, "totalPrice" numeric(15,2) NOT NULL, "discountAmount" numeric(15,2), "finalPrice" numeric(15,2), "voucherCode" character varying(50), "cancelReason" text, "expiredAt" TIMESTAMP, "confirmedAt" TIMESTAMP, "completedAt" TIMESTAMP, "status" character varying(50) NOT NULL, "cancelledBy" uuid, "customerId" uuid NOT NULL, CONSTRAINT "UQ_9add00bfd42ae2bbe830bab9aa2" UNIQUE ("code"), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50), "amount" numeric(15,2) NOT NULL, "method" character varying(50) NOT NULL, "transactionId" character varying(255), "bankCode" character varying(50), "responseCode" character varying(50), "responseMessage" text, "paidAt" TIMESTAMP, "status" character varying(50) NOT NULL, "bookingId" uuid NOT NULL, CONSTRAINT "UQ_2b3c754ea3bf83cab000b8ed3d4" UNIQUE ("code"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vouchers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50) NOT NULL, "name" character varying(255), "description" text, "discountType" character varying(50) NOT NULL, "discountValue" numeric(15,2) NOT NULL, "maxDiscount" numeric(15,2), "minOrder" numeric(15,2), "quantity" integer, "usedCount" integer NOT NULL DEFAULT '0', "applicableTours" json, "applicableCategories" json, "status" character varying(50) NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "UQ_efc30b2b9169e05e0e1e19d6dd6" UNIQUE ("code"), CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_vouchers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "customerId" uuid NOT NULL, "voucherId" uuid NOT NULL, "uniqueCode" character varying(50) NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "usedDate" TIMESTAMP, "bookingId" uuid, "receivedAt" TIMESTAMP NOT NULL DEFAULT now(), "expiredAt" TIMESTAMP, CONSTRAINT "UQ_33eb17d15a5f040231d55eddfe9" UNIQUE ("uniqueCode"), CONSTRAINT "PK_66534a148ba312dd88e48ee6072" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file_archive" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "fileUrl" text NOT NULL, "fileName" text NOT NULL, "fileType" character varying(50), "fileSize" bigint, "description" text, "customerId" uuid, "reviewId" uuid, CONSTRAINT "PK_20039129070a2e228880a2fcd3f" PRIMARY KEY ("id")); COMMENT ON COLUMN "file_archive"."fileUrl" IS 'Đường dẫn tệp'; COMMENT ON COLUMN "file_archive"."fileName" IS 'Tên tệp'; COMMENT ON COLUMN "file_archive"."description" IS 'Mô tả tệp'`,
    );
    await queryRunner.query(
      `CREATE TABLE "action_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "createdById" uuid, "createdByName" character varying(250) NOT NULL, "createdNote" character varying(500), "description" text NOT NULL, "dataOld" text, "dataNew" text, "type" character varying NOT NULL, "functionType" character varying(250) NOT NULL, "functionId" uuid, CONSTRAINT "PK_cc15d2a348eaf2e1e153055380c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "verify_otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "otpCode" character varying(50) NOT NULL, "phone" character varying(50), "email" character varying(50), "sendMethod" character varying(50) NOT NULL, "dateExpired" TIMESTAMP WITH TIME ZONE, "error" text, CONSTRAINT "PK_1d8c6eba132a28e15964f6e3f03" PRIMARY KEY ("id")); COMMENT ON COLUMN "verify_otp"."otpCode" IS 'Mã otp'; COMMENT ON COLUMN "verify_otp"."phone" IS 'Số điện thoại'; COMMENT ON COLUMN "verify_otp"."email" IS 'email'; COMMENT ON COLUMN "verify_otp"."sendMethod" IS 'Phương thức gửi otp EOTPSendMethod'; COMMENT ON COLUMN "verify_otp"."dateExpired" IS 'Thời hạn mã xác thực'; COMMENT ON COLUMN "verify_otp"."error" IS 'Lỗi khi gửi (nếu có)'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5fc0a1176018184506aa41ec4e" ON "verify_otp" ("createdDate") `,
    );
    await queryRunner.query(
      `CREATE TABLE "setting_string" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(100) NOT NULL, "name" character varying(250) NOT NULL, "type" character varying(50) NOT NULL, "value" double precision, "valueString" text, CONSTRAINT "PK_cd993a95b69adc4fcb1c4e779c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_09269227c7acf3cdf47ea4051e1" FOREIGN KEY ("authorId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_0a190c1025d773ec5ca2c039c92" FOREIGN KEY ("postId") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_20dc43a1f83f8b1381fd6f53542" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_02b996a30d6a7a934ef71d97739" FOREIGN KEY ("parentId") REFERENCES "blog_comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_c0c710fa8182fe57bf0fd9d6104" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" ADD CONSTRAINT "FK_8b2f5487bc764dacc3a82570f93" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_2c43c3d51c42929dd1684d049cf" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_c6c520dfb9a4d6dd749e73b13de" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_responses" ADD CONSTRAINT "FK_525b45e2fb4ec087d1aabc44387" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_a2814316e17ed640ec3b970d21d" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_6d99bdfa69280ede313699fab92" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_c357057587a1c2afae453515bf6" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_itineraries" ADD CONSTRAINT "FK_24c9104671ef73ea5e9aa36fe5b" FOREIGN KEY ("tourDetailId") REFERENCES "tour_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_prices" ADD CONSTRAINT "FK_264845303e37b5566397a6708fa" FOREIGN KEY ("tourDetailId") REFERENCES "tour_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_details" ADD CONSTRAINT "FK_30994aed327aea1b5f0c2106a2b" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD CONSTRAINT "FK_1638104fb5dd72a3ea907a68098" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD CONSTRAINT "FK_232bc6b873b96e13374d9337862" FOREIGN KEY ("tourDetailId") REFERENCES "tour_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD CONSTRAINT "FK_d1517fea522dec4f48aaf09ec63" FOREIGN KEY ("tourPriceId") REFERENCES "tour_prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD CONSTRAINT "FK_67b9cd20f987fc6dc70f7cd283f" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" ADD CONSTRAINT "FK_1ead3dc5d71db0ea822706e389d" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_vouchers" ADD CONSTRAINT "FK_c50127be74850dc25e1968210c0" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_vouchers" ADD CONSTRAINT "FK_133943cc01869b20c2064e9f79b" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD CONSTRAINT "FK_d88577001d24d9bdf00e81004a4" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" ADD CONSTRAINT "FK_b12b71e081d007acdf74708f4b4" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "FK_b12b71e081d007acdf74708f4b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file_archive" DROP CONSTRAINT "FK_d88577001d24d9bdf00e81004a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_vouchers" DROP CONSTRAINT "FK_133943cc01869b20c2064e9f79b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_vouchers" DROP CONSTRAINT "FK_c50127be74850dc25e1968210c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payments" DROP CONSTRAINT "FK_1ead3dc5d71db0ea822706e389d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" DROP CONSTRAINT "FK_67b9cd20f987fc6dc70f7cd283f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP CONSTRAINT "FK_d1517fea522dec4f48aaf09ec63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP CONSTRAINT "FK_232bc6b873b96e13374d9337862"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP CONSTRAINT "FK_1638104fb5dd72a3ea907a68098"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_details" DROP CONSTRAINT "FK_30994aed327aea1b5f0c2106a2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_prices" DROP CONSTRAINT "FK_264845303e37b5566397a6708fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tour_itineraries" DROP CONSTRAINT "FK_24c9104671ef73ea5e9aa36fe5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_c357057587a1c2afae453515bf6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_6d99bdfa69280ede313699fab92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_a2814316e17ed640ec3b970d21d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_responses" DROP CONSTRAINT "FK_525b45e2fb4ec087d1aabc44387"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_c6c520dfb9a4d6dd749e73b13de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_2c43c3d51c42929dd1684d049cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification_settings" DROP CONSTRAINT "FK_8b2f5487bc764dacc3a82570f93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_c0c710fa8182fe57bf0fd9d6104"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_02b996a30d6a7a934ef71d97739"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_20dc43a1f83f8b1381fd6f53542"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_0a190c1025d773ec5ca2c039c92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_09269227c7acf3cdf47ea4051e1"`,
    );
    await queryRunner.query(`DROP TABLE "setting_string"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5fc0a1176018184506aa41ec4e"`,
    );
    await queryRunner.query(`DROP TABLE "verify_otp"`);
    await queryRunner.query(`DROP TABLE "action_logs"`);
    await queryRunner.query(`DROP TABLE "file_archive"`);
    await queryRunner.query(`DROP TABLE "user_vouchers"`);
    await queryRunner.query(`DROP TABLE "vouchers"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "booking_details"`);
    await queryRunner.query(`DROP TABLE "tour_details"`);
    await queryRunner.query(`DROP TABLE "tour_prices"`);
    await queryRunner.query(`DROP TABLE "tour_itineraries"`);
    await queryRunner.query(`DROP TABLE "tours"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "review_responses"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "notification_settings"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "faqs"`);
    await queryRunner.query(`DROP TABLE "destinations"`);
    await queryRunner.query(`DROP TABLE "blog_comments"`);
    await queryRunner.query(`DROP TABLE "blog_posts"`);
    await queryRunner.query(`DROP TABLE "translations"`);
  }
}
