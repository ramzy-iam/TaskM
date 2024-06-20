import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718850362103 implements MigrationInterface {
    name = 'Migration1718850362103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "otpExpiryTime"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "token" character varying`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "tokenExpires" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "tokenExpires"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "otpExpiryTime" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "otp" character varying`);
    }

}
