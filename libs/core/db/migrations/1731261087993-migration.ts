import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1731261087993 implements MigrationInterface {
    name = 'Migration1731261087993'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "UQ_bc99b5d69794e566ae929bf8b26"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Competences_code_enum" RENAME TO "Competences_code_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Competences_code_enum" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MTPE', 'SUBT', 'DTP', 'VO', 'VOIREC', 'VIDEO', 'PHOTO', 'DESIGN', 'CWRITE', 'QA', 'PRINT', 'DESPRI', 'FBACK')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ALTER COLUMN "code" TYPE "taskm"."Competences_code_enum" USING "code"::"text"::"taskm"."Competences_code_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Competences_code_enum_old"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Projects_tasktype_enum" RENAME TO "Projects_tasktype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_tasktype_enum" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MTPE', 'SUBT', 'DTP', 'VO', 'VOIREC', 'VIDEO', 'PHOTO', 'DESIGN', 'CWRITE', 'QA', 'PRINT', 'DESPRI', 'FBACK')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "taskType" TYPE "taskm"."Projects_tasktype_enum" USING "taskType"::"text"::"taskm"."Projects_tasktype_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_tasktype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Tasks_type_enum" RENAME TO "Tasks_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Tasks_type_enum" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MTPE', 'SUBT', 'DTP', 'VO', 'VOIREC', 'VIDEO', 'PHOTO', 'DESIGN', 'CWRITE', 'QA', 'PRINT', 'DESPRI', 'FBACK')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ALTER COLUMN "type" TYPE "taskm"."Tasks_type_enum" USING "type"::"text"::"taskm"."Tasks_type_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Tasks_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "UQ_bc99b5d69794e566ae929bf8b26" UNIQUE ("serviceProviderId", "code", "unit", "currency", "rate")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" DROP CONSTRAINT "UQ_bc99b5d69794e566ae929bf8b26"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Tasks_type_enum_old" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MPTE', 'SUBT', 'DTP', 'VO')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Tasks" ALTER COLUMN "type" TYPE "taskm"."Tasks_type_enum_old" USING "type"::"text"::"taskm"."Tasks_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "taskm"."Tasks_type_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Tasks_type_enum_old" RENAME TO "Tasks_type_enum"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_tasktype_enum_old" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MPTE', 'SUBT', 'DTP', 'VO')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ALTER COLUMN "taskType" TYPE "taskm"."Projects_tasktype_enum_old" USING "taskType"::"text"::"taskm"."Projects_tasktype_enum_old"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_tasktype_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Projects_tasktype_enum_old" RENAME TO "Projects_tasktype_enum"`);
        await queryRunner.query(`CREATE TYPE "taskm"."Competences_code_enum_old" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MPTE', 'SUBT', 'DTP', 'VO')`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ALTER COLUMN "code" TYPE "taskm"."Competences_code_enum_old" USING "code"::"text"::"taskm"."Competences_code_enum_old"`);
        await queryRunner.query(`DROP TYPE "taskm"."Competences_code_enum"`);
        await queryRunner.query(`ALTER TYPE "taskm"."Competences_code_enum_old" RENAME TO "Competences_code_enum"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Competences" ADD CONSTRAINT "UQ_bc99b5d69794e566ae929bf8b26" UNIQUE ("code", "rate", "unit", "currency", "serviceProviderId")`);
    }

}
