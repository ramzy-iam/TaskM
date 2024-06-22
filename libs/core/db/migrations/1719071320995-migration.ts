import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719071320995 implements MigrationInterface {
    name = 'Migration1719071320995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" ADD "isVisible" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Workspaces" DROP COLUMN "isVisible"`);
    }

}
