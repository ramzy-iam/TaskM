import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718574665791 implements MigrationInterface {
    name = 'Migration1718574665791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "dev"."Roles_name_enum" RENAME TO "Roles_name_enum_old"`);
        await queryRunner.query(`CREATE TYPE "dev"."Roles_name_enum" AS ENUM('ADMIN', 'LINGUIST')`);
        await queryRunner.query(`ALTER TABLE "dev"."Roles" ALTER COLUMN "name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "dev"."Roles" ALTER COLUMN "name" TYPE "dev"."Roles_name_enum" USING "name"::"text"::"dev"."Roles_name_enum"`);
        await queryRunner.query(`ALTER TABLE "dev"."Roles" ALTER COLUMN "name" SET DEFAULT 'LINGUIST'`);
        await queryRunner.query(`DROP TYPE "dev"."Roles_name_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "dev"."Roles_name_enum_old" AS ENUM('admin', 'linguist')`);
        await queryRunner.query(`ALTER TABLE "dev"."Roles" ALTER COLUMN "name" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "dev"."Roles" ALTER COLUMN "name" TYPE "dev"."Roles_name_enum_old" USING "name"::"text"::"dev"."Roles_name_enum_old"`);
        await queryRunner.query(`ALTER TABLE "dev"."Roles" ALTER COLUMN "name" SET DEFAULT 'linguist'`);
        await queryRunner.query(`DROP TYPE "dev"."Roles_name_enum"`);
        await queryRunner.query(`ALTER TYPE "dev"."Roles_name_enum_old" RENAME TO "Roles_name_enum"`);
    }

}
