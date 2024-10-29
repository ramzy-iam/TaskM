import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1725051524448 implements MigrationInterface {
    name = 'Migration1725051524448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "taskm"."Competences_code_enum" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MPTE', 'SUBT', 'DTP', 'VO')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Competences_unit_enum" AS ENUM('word', 'page', 'minute', 'hour')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Competences_currency_enum" AS ENUM('USD', 'EURO', 'CAD', 'XAF')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Competences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "code" "taskm"."Competences_code_enum" NOT NULL, "rate" numeric(20,6) NOT NULL, "unit" "taskm"."Competences_unit_enum" NOT NULL, "currency" "taskm"."Competences_currency_enum" NOT NULL DEFAULT 'XAF', "serviceproviderId" uuid NOT NULL, CONSTRAINT "PK_d56756e9b0a722497a1457ea65b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "taskm"."ServiceProviders_accounttype_enum" AS ENUM('PAYONNEER', 'PAYPAL', 'BANK', 'OM', 'MOMO', 'CASH')`);
        await queryRunner.query(`CREATE TABLE "taskm"."ServiceProviders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying NOT NULL, "accountType" "taskm"."ServiceProviders_accounttype_enum" NOT NULL, "accountName" character varying NOT NULL, "accountNumber" character varying NOT NULL, CONSTRAINT "UQ_4e3558700a7f94a7b5984195230" UNIQUE ("email"), CONSTRAINT "PK_6fcf82184e304cddbb55b759b0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "FK_6a98c4754647f5b34f9c6274a90" FOREIGN KEY ("serviceproviderId") REFERENCES "taskm"."ServiceProviders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "FK_6a98c4754647f5b34f9c6274a90"`);
        await queryRunner.query(`DROP TABLE "taskm"."ServiceProviders"`);
        await queryRunner.query(`DROP TYPE "taskm"."ServiceProviders_accounttype_enum"`);
        await queryRunner.query(`DROP TABLE "taskm"."Competences"`);
        await queryRunner.query(`DROP TYPE "taskm"."Competences_currency_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Competences_unit_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Competences_code_enum"`);
    }

}
