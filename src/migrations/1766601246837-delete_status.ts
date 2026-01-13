import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteStatus1766601246837 implements MigrationInterface {
    name = 'DeleteStatus1766601246837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "position" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "position_master" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "part_master" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "part" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "shift_master" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "shift" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "department" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "branch" DROP COLUMN "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branch" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "department" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "shift" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "shift_master" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "part" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "part_master" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "position_master" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "position" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
    }

}
