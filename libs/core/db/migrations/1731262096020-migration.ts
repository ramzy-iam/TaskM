import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1731262096020 implements MigrationInterface {
    name = 'Migration1731262096020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "taskm"."Projects_status_enum" RENAME TO "Projects_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_status_enum" AS ENUM('NOT_STARTED', 'DELIVERED', 'IN_PROGRESS', 'CANCELLED', 'ON_HOLD', 'WAITING_QA', 'CLOSED', 'QA_ING')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" TYPE "taskm"."Projects_status_enum" USING "status"::"text"::"taskm"."Projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_status_enum_old" AS ENUM('APPROVED_CLOSED', 'CANCELLED', 'DELIVERED', 'DELIVERED_WAITING_QA', 'IN_PROGRESS', 'NOT_STARTED', 'ON_HOLD', 'QA_REVIEW')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" TYPE "taskm"."Projects_status_enum_old" USING "status"::"text"::"taskm"."Projects_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_status_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Projects_status_enum_old" RENAME TO "Projects_status_enum"`);
    }

}
