import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730820617664 implements MigrationInterface {
    name = 'Migration1730820617664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "FK_6a98c4754647f5b34f9c6274a90"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" DROP CONSTRAINT "FK_ae4813d64447e3b8fe00ff99f50"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "UQ_e627d7caf7c45f9b5ff10bd8a44"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Linguists_accounttype_enum" RENAME TO "Linguists_accounttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."ServiceProviders_accounttype_enum" AS ENUM('PAYONNEER', 'PAYPAL', 'BANK', 'OM', 'MOMO', 'CASH')`);
        await queryRunner.query(`ALTER TABLE "taskm"."ServiceProviders" ALTER COLUMN "accountType" TYPE "taskm"."ServiceProviders_accounttype_enum" USING "accountType"::"text"::"taskm"."ServiceProviders_accounttype_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Linguists_accounttype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Projects_status_enum" RENAME TO "Projects_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_status_enum" AS ENUM('NOT_STARTED', 'DELIVERED', 'IN_PROGRESS', 'CANCELLED', 'ON_HOLD', 'DELIVERED_WAITING_QA', 'APPROVED_CLOSED', 'QA_REVIEW')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" TYPE "taskm"."Projects_status_enum" USING "status"::"text"::"taskm"."Projects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Tasks_status_enum" RENAME TO "Tasks_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Tasks_status_enum" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ALTER COLUMN "status" TYPE "taskm"."Tasks_status_enum" USING "status"::"text"::"taskm"."Tasks_status_enum"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`DROP TYPE "taskm"."Tasks_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "UQ_bc99b5d69794e566ae929bf8b26" UNIQUE ("serviceProviderId", "code", "unit", "currency", "rate")`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "FK_fdbe2aacea2cb7eb042c8855141" FOREIGN KEY ("serviceProviderId") REFERENCES "taskm"."ServiceProviders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ADD CONSTRAINT "FK_183cf0c209b77c36076ce17aff1" FOREIGN KEY ("serviceProviderId") REFERENCES "taskm"."ServiceProviders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" DROP CONSTRAINT "FK_183cf0c209b77c36076ce17aff1"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "FK_fdbe2aacea2cb7eb042c8855141"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "UQ_bc99b5d69794e566ae929bf8b26"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Tasks_status_enum_old" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ALTER COLUMN "status" TYPE "taskm"."Tasks_status_enum_old" USING "status"::"text"::"taskm"."Tasks_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`DROP TYPE "taskm"."Tasks_status_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Tasks_status_enum_old" RENAME TO "Tasks_status_enum"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_status_enum_old" AS ENUM('NOT_STARTED', 'COMPLETED', 'IN_PROGRESS', 'CANCELLED', 'ON_HOLD', 'DELIVERED_WAITING_QA', 'DELIVERED_CLOSED')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" TYPE "taskm"."Projects_status_enum_old" USING "status"::"text"::"taskm"."Projects_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED'`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_status_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Projects_status_enum_old" RENAME TO "Projects_status_enum"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Linguists_accounttype_enum_old" AS ENUM('PAYONNEER', 'PAYPAL', 'BANK', 'OM', 'MOMO', 'CASH')`);
        await queryRunner.query(`ALTER TABLE "taskm"."ServiceProviders" ALTER COLUMN "accountType" TYPE "taskm"."Linguists_accounttype_enum_old" USING "accountType"::"text"::"taskm"."Linguists_accounttype_enum_old"`);
        await queryRunner.query(`DROP TYPE "taskm"."ServiceProviders_accounttype_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Linguists_accounttype_enum_old" RENAME TO "Linguists_accounttype_enum"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "UQ_e627d7caf7c45f9b5ff10bd8a44" UNIQUE ("code", "rate", "unit", "currency", "serviceProviderId")`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ADD CONSTRAINT "FK_ae4813d64447e3b8fe00ff99f50" FOREIGN KEY ("serviceProviderId") REFERENCES "taskm"."ServiceProviders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "FK_6a98c4754647f5b34f9c6274a90" FOREIGN KEY ("serviceProviderId") REFERENCES "taskm"."ServiceProviders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
