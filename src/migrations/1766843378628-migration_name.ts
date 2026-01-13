import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1766843378628 implements MigrationInterface {
    name = 'MigrationName1766843378628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_certificate" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "employee_certificate" ADD "code" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee_certificate" ADD CONSTRAINT "UQ_6778bd5e0b3aa07b07175b4874a" UNIQUE ("code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_certificate" DROP CONSTRAINT "UQ_6778bd5e0b3aa07b07175b4874a"`);
        await queryRunner.query(`ALTER TABLE "employee_certificate" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "employee_certificate" ADD "code" character varying`);
    }

}
