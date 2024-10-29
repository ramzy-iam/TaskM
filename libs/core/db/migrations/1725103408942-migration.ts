import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725103408942 implements MigrationInterface {
    name = 'Migration1725103408942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "UQ_e627d7caf7c45f9b5ff10bd8a44" UNIQUE ("serviceproviderId", "code", "unit", "currency", "rate")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "UQ_e627d7caf7c45f9b5ff10bd8a44"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP COLUMN "active"`);
    }

}
