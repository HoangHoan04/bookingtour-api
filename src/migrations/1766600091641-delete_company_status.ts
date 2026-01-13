import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteCompanyStatus1766600091641 implements MigrationInterface {
    name = 'DeleteCompanyStatus1766600091641'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
    }

}
