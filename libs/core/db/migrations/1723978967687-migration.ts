import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723978967687 implements MigrationInterface {
    name = 'Migration1723978967687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP CONSTRAINT "UQ_8a95a0fdd9fa94699ac15218cd3"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP COLUMN "internalPoId"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD "clientPoId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD CONSTRAINT "UQ_a704c1511d3db4ea29714eed390" UNIQUE ("poId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP CONSTRAINT "UQ_a704c1511d3db4ea29714eed390"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP COLUMN "clientPoId"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD "internalPoId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD CONSTRAINT "UQ_8a95a0fdd9fa94699ac15218cd3" UNIQUE ("internalPoId")`);
    }

}
