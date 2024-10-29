import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1726838247023 implements MigrationInterface {
    name = 'Migration1726838247023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "taskm"."Clients_currency_enum" RENAME TO "Clients_currency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Clients_currency_enum" AS ENUM('USD', 'EUR', 'CAD', 'XAF')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Clients" ALTER COLUMN "currency" TYPE "taskm"."Clients_currency_enum" USING "currency"::"text"::"taskm"."Clients_currency_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Clients_currency_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "UQ_e627d7caf7c45f9b5ff10bd8a44"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Competences_currency_enum" RENAME TO "Competences_currency_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Competences_currency_enum" AS ENUM('USD', 'EUR', 'CAD', 'XAF')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ALTER COLUMN "currency" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ALTER COLUMN "currency" TYPE "taskm"."Competences_currency_enum" USING "currency"::"text"::"taskm"."Competences_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ALTER COLUMN "currency" SET DEFAULT 'XAF'`);
        await queryRunner.query(`DROP TYPE "taskm"."Competences_currency_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "UQ_e627d7caf7c45f9b5ff10bd8a44" UNIQUE ("serviceproviderId", "code", "unit", "currency", "rate")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "UQ_e627d7caf7c45f9b5ff10bd8a44"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Competences_currency_enum_old" AS ENUM('USD', 'EURO', 'CAD', 'XAF')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ALTER COLUMN "currency" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ALTER COLUMN "currency" TYPE "taskm"."Competences_currency_enum_old" USING "currency"::"text"::"taskm"."Competences_currency_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ALTER COLUMN "currency" SET DEFAULT 'XAF'`);
        await queryRunner.query(`DROP TYPE "taskm"."Competences_currency_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Competences_currency_enum_old" RENAME TO "Competences_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "UQ_e627d7caf7c45f9b5ff10bd8a44" UNIQUE ("code", "rate", "unit", "currency", "serviceproviderId")`);
        await queryRunner.query(`CREATE TYPE "taskm"."Clients_currency_enum_old" AS ENUM('USD', 'EURO', 'CAD', 'XAF')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Clients" ALTER COLUMN "currency" TYPE "taskm"."Clients_currency_enum_old" USING "currency"::"text"::"taskm"."Clients_currency_enum_old"`);
        await queryRunner.query(`DROP TYPE "taskm"."Clients_currency_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Clients_currency_enum_old" RENAME TO "Clients_currency_enum"`);
    }

}
