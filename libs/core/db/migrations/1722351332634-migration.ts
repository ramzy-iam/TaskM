import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722351332634 implements MigrationInterface {
    name = 'Migration1722351332634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "taskm"."Clients_currency_enum" AS ENUM('USD', 'EURO', 'CAD', 'XAF')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Clients_paymentmethod_enum" AS ENUM('Payonneer', 'PayPal', 'Bank', 'OM', 'MoMo', 'Cash')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "code" character varying NOT NULL, "paymentDueDays" integer NOT NULL, "billingEmailAddress" character varying NOT NULL, "billingPeriod" character varying NOT NULL, "currency" "taskm"."Clients_currency_enum" NOT NULL, "paymentMethod" "taskm"."Clients_paymentmethod_enum" NOT NULL, CONSTRAINT "UQ_ddb0ff82bc649f4594ed5fb7a2c" UNIQUE ("code"), CONSTRAINT "PK_8dadaa0dc6305d95e1d1a6b9544" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_status_enum" AS ENUM('Delivered & waiting QA', 'Completed', 'Not Started', 'Delivered & closed', 'In progress', 'Cancelled', 'On Hold')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_tasktype_enum" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MPTE', 'SUBT', 'DTP', 'VO')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_lang_enum" AS ENUM('Fr', 'En', 'En-Fr', 'EnUK-FrFR', 'EnUK-FrCA', 'EnUS-FrFR', 'EnUS-FrCA', 'Fr-En', 'FrFR-EnUK', 'FrFR-EnUS', 'FrCA-EnUK', 'FrCA-EnUS', 'FrCA-EnCA', 'Spa-Fr', 'Spa-FrFR', 'Spa-FrCA', 'Ger-Fr', 'Ger-FrFR', 'Ger- FrCA')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_unit_enum" AS ENUM('word', 'page', 'minute', 'hour')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "clientPM" character varying, "status" "taskm"."Projects_status_enum" NOT NULL DEFAULT 'Not Started', "taskType" "taskm"."Projects_tasktype_enum" NOT NULL, "lang" "taskm"."Projects_lang_enum" NOT NULL, "poId" character varying NOT NULL, "internalPoId" character varying NOT NULL, "count" integer NOT NULL, "reference" character varying NOT NULL, "rate" integer NOT NULL, "unit" "taskm"."Projects_unit_enum" NOT NULL, "clientId" uuid NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE NOT NULL, "internalDeadline" TIMESTAMP WITH TIME ZONE NOT NULL, "receivedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "deliveredAt" TIMESTAMP WITH TIME ZONE, "invoicedAt" TIMESTAMP WITH TIME ZONE, "expectedPaidAt" TIMESTAMP WITH TIME ZONE, "paidAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_8a95a0fdd9fa94699ac15218cd3" UNIQUE ("internalPoId"), CONSTRAINT "PK_b25c37f2cdf0161b4f10ed3121c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD CONSTRAINT "FK_06f7251c92cc0fc55fd6da112db" FOREIGN KEY ("clientId") REFERENCES "taskm"."Clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP CONSTRAINT "FK_06f7251c92cc0fc55fd6da112db"`);
        await queryRunner.query(`DROP TABLE "taskm"."Projects"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_unit_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_lang_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_tasktype_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "taskm"."Clients"`);
        await queryRunner.query(`DROP TYPE "taskm"."Clients_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Clients_currency_enum"`);
    }

}
