import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724620622938 implements MigrationInterface {
    name = 'Migration1724620622938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "taskm"."Projects_status_enum" RENAME TO "Projects_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_status_enum" AS ENUM('NOT_STARTED', 'COMPLETED', 'IN_PROGRESS', 'CANCELLED', 'ON_HOLD', 'DELIVERED_WAITING_QA', 'DELIVERED_CLOSED')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" TYPE "taskm"."Projects_status_enum" USING "status"::"text"::"taskm"."Projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_status_enum_old" AS ENUM('Delivered & waiting QA', 'Completed', 'Not Started', 'Delivered & closed', 'In progress', 'Cancelled', 'On Hold')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" TYPE "taskm"."Projects_status_enum_old" USING "status"::"text"::"taskm"."Projects_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" SET DEFAULT 'Not Started'`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_status_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Projects_status_enum_old" RENAME TO "Projects_status_enum"`);
    }

}
