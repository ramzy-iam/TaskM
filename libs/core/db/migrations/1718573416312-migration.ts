import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1718573416312 implements MigrationInterface {
    name = 'Migration1718573416312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Users" RENAME COLUMN "isVerified" TO "state"`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" ADD "tokenInvitation" character varying`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" ADD "tokenInvitationExpires" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE TYPE "dev"."WorkspaceUsers_state_enum" AS ENUM('UNCONFIRMED', 'CONFIRMED', 'INVITED', 'SUSPENDED', 'EXPIRED', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" ADD "state" "dev"."WorkspaceUsers_state_enum" NOT NULL DEFAULT 'CONFIRMED'`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "state"`);
        await queryRunner.query(`CREATE TYPE "dev"."Users_state_enum" AS ENUM('UNCONFIRMED', 'CONFIRMED', 'INVITED', 'SUSPENDED', 'EXPIRED', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "state" "dev"."Users_state_enum" NOT NULL DEFAULT 'UNCONFIRMED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."Users" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "dev"."Users_state_enum"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" ADD "state" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "dev"."WorkspaceUsers_state_enum"`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" DROP COLUMN "tokenInvitationExpires"`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" DROP COLUMN "tokenInvitation"`);
        await queryRunner.query(`ALTER TABLE "dev"."Users" RENAME COLUMN "state" TO "isVerified"`);
    }

}
