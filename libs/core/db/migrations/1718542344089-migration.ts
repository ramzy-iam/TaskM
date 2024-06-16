import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718542344089 implements MigrationInterface {
    name = 'Migration1718542344089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "otp" character varying`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "otpExpiryTime" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "passwordResetToken" character varying`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "passwordResetExpires" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "isVerified" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "passwordResetExpires"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "passwordResetToken"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "otpExpiryTime"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "otp"`);
    }

}
