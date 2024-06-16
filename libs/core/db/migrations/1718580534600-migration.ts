import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718580534600 implements MigrationInterface {
    name = 'Migration1718580534600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" DROP CONSTRAINT "UQ_70ae81ece915f7f08f436d6c299"`);
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" ADD CONSTRAINT "UQ_29b23d758db2c080a17dd01cfd8" UNIQUE ("name", "userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" DROP CONSTRAINT "UQ_29b23d758db2c080a17dd01cfd8"`);
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" ADD CONSTRAINT "UQ_70ae81ece915f7f08f436d6c299" UNIQUE ("name")`);
    }

}
