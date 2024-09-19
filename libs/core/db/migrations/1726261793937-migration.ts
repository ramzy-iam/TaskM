import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1726261793937 implements MigrationInterface {
    name = 'Migration1726261793937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "taskm"."Tasks_status_enum" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Tasks_type_enum" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MPTE', 'SUBT', 'DTP', 'VO')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Tasks_unit_enum" AS ENUM('word', 'page', 'minute', 'hour')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Tasks_lang_enum" AS ENUM('Fr', 'En', 'En-Fr', 'EnUK-FrFR', 'EnUK-FrCA', 'EnUS-FrFR', 'EnUS-FrCA', 'Fr-En', 'FrFR-EnUK', 'FrFR-EnUS', 'FrCA-EnUK', 'FrCA-EnUS', 'FrCA-EnCA', 'Spa-Fr', 'Spa-FrFR', 'Spa-FrCA', 'Ger-Fr', 'Ger-FrFR', 'Ger- FrCA')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "linguistId" uuid NOT NULL, "projectId" uuid NOT NULL, "rateId" uuid NOT NULL, "code" character varying NOT NULL, "status" "taskm"."Tasks_status_enum" NOT NULL DEFAULT 'NOT_STARTED', "type" "taskm"."Tasks_type_enum" NOT NULL, "unit" "taskm"."Tasks_unit_enum" NOT NULL, "lang" "taskm"."Tasks_lang_enum" NOT NULL, "count" numeric(20,6) NOT NULL, "assignedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "deliveredAt" TIMESTAMP WITH TIME ZONE, "deadline" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_fef49a104df9857a8edfec2ee38" UNIQUE ("code"), CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ADD CONSTRAINT "FK_ae4813d64447e3b8fe00ff99f50" FOREIGN KEY ("linguistId") REFERENCES "taskm"."Linguists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ADD CONSTRAINT "FK_ce2eeb5146a99fc267909ac0e12" FOREIGN KEY ("projectId") REFERENCES "taskm"."Projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ADD CONSTRAINT "FK_1c0390e11179e3990e98cf65788" FOREIGN KEY ("rateId") REFERENCES "taskm"."Competences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" DROP CONSTRAINT "FK_1c0390e11179e3990e98cf65788"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" DROP CONSTRAINT "FK_ce2eeb5146a99fc267909ac0e12"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" DROP CONSTRAINT "FK_ae4813d64447e3b8fe00ff99f50"`);
        await queryRunner.query(`DROP TABLE "taskm"."Tasks"`);
        await queryRunner.query(`DROP TYPE "taskm"."Tasks_lang_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Tasks_unit_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Tasks_type_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Tasks_status_enum"`);
    }

}
