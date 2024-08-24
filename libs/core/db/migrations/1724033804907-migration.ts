import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724033804907 implements MigrationInterface {
    name = 'Migration1724033804907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP COLUMN "reference"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD "reference" character varying NOT NULL`);
    }

}
