import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724033685402 implements MigrationInterface {
    name = 'Migration1724033685402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP COLUMN "count"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD "count" numeric(20,6) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD "rate" numeric(20,6) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD "rate" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP COLUMN "count"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD "count" integer NOT NULL`);
    }

}
