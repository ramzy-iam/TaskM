import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719685787700 implements MigrationInterface {
    name = 'Migration1719685787700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "dev"."Clients_currency_enum" AS ENUM('USD', 'EURO', 'CAD', 'XAF')`);
        await queryRunner.query(`CREATE TYPE "dev"."Clients_paymentmethod_enum" AS ENUM('Payonneer', 'PayPal', 'Bank', 'OM', 'MoMo', 'Cash')`);
        await queryRunner.query(`CREATE TABLE "dev"."Clients" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "code" character varying NOT NULL, "paymentDueDays" integer NOT NULL, "billingEmailAddress" character varying NOT NULL, "billingPeriod" character varying NOT NULL, "currency" "dev"."Clients_currency_enum" NOT NULL, "paymentMethod" "dev"."Clients_paymentmethod_enum" NOT NULL, CONSTRAINT "UQ_ddb0ff82bc649f4594ed5fb7a2c" UNIQUE ("code"), CONSTRAINT "PK_8dadaa0dc6305d95e1d1a6b9544" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dev"."Clients"`);
        await queryRunner.query(`DROP TYPE "dev"."Clients_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "dev"."Clients_currency_enum"`);
    }

}
