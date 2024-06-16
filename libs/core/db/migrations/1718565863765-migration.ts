import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718565863765 implements MigrationInterface {
    name = 'Migration1718565863765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" DROP CONSTRAINT "UQ_32b6b71c90ef76f7737345f49e5"`);
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" ADD CONSTRAINT "UQ_70ae81ece915f7f08f436d6c299" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" DROP CONSTRAINT "UQ_70ae81ece915f7f08f436d6c299"`);
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" ADD CONSTRAINT "UQ_32b6b71c90ef76f7737345f49e5" UNIQUE ("code")`);
    }

}
