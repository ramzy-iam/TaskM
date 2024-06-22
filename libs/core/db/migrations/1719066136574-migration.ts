import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1719066136574 implements MigrationInterface {
    name = 'Migration1719066136574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "dev"."Users_state_enum" AS ENUM('UNCONFIRMED', 'CONFIRMED', 'INVITED', 'SUSPENDED', 'EXPIRED', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "dev"."Users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "token" character varying, "tokenExpires" TIMESTAMP WITH TIME ZONE, "passwordResetToken" character varying, "passwordResetExpires" TIMESTAMP WITH TIME ZONE, "state" "dev"."Users_state_enum" NOT NULL DEFAULT 'UNCONFIRMED', "activeWorkspaceId" integer, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "dev"."Roles_name_enum" AS ENUM('Admin', 'Linguist', 'Simple User')`);
        await queryRunner.query(`CREATE TABLE "dev"."Roles" ("id" SERIAL NOT NULL, "name" "dev"."Roles_name_enum" DEFAULT 'Simple User', CONSTRAINT "UQ_8eadedb8470c92966389ecc2165" UNIQUE ("name"), CONSTRAINT "PK_efba48c6a0c7a9b6260f771b165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "dev"."WorkspaceUsers_state_enum" AS ENUM('UNCONFIRMED', 'CONFIRMED', 'INVITED', 'SUSPENDED', 'EXPIRED', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "dev"."WorkspaceUsers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "workspaceId" integer NOT NULL, "tokenInvitation" character varying, "tokenInvitationExpires" TIMESTAMP WITH TIME ZONE, "state" "dev"."WorkspaceUsers_state_enum" NOT NULL DEFAULT 'CONFIRMED', "userId" integer NOT NULL, CONSTRAINT "PK_94f6f5026059fab49269d3648fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."Workspaces" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, CONSTRAINT "UQ_70ae81ece915f7f08f436d6c299" UNIQUE ("name"), CONSTRAINT "PK_35160e1c18ee262230a1848e5fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."CaslSubjects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c6022cacc22e4ade0583b68b74d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "dev"."Permissions_action_enum" AS ENUM('manage', 'create', 'read', 'update', 'delete', 'view', 'filter', 'search', 'cancel', 'approve', 'invite', 'remove')`);
        await queryRunner.query(`CREATE TABLE "dev"."Permissions" ("id" SERIAL NOT NULL, "subjectId" integer NOT NULL, "action" "dev"."Permissions_action_enum" NOT NULL, "conditions" jsonb, CONSTRAINT "PK_e83fa8a46bd5a3bfaa095d40812" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."RolePermissions" ("id" SERIAL NOT NULL, "roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_29cf5edaa365f1e090b95eb6708" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dev"."workspace_users_roles_roles" ("workspaceUsersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_b45b0d3575834fc65bedf96d8cc" PRIMARY KEY ("workspaceUsersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b2d66e2ecfac30b0194f6b0d47" ON "dev"."workspace_users_roles_roles" ("workspaceUsersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_11fdecc7d01cff567c28c443a2" ON "dev"."workspace_users_roles_roles" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" ADD CONSTRAINT "FK_18465bea2ca39d0aeff88697589" FOREIGN KEY ("workspaceId") REFERENCES "dev"."Workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" ADD CONSTRAINT "FK_66f91971da4caba7ce7facddda8" FOREIGN KEY ("userId") REFERENCES "dev"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."Permissions" ADD CONSTRAINT "FK_2d0e04a03f798614c9f4fec3c7b" FOREIGN KEY ("subjectId") REFERENCES "dev"."CaslSubjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."RolePermissions" ADD CONSTRAINT "FK_5bc4baf52e29432973ac9ebf90a" FOREIGN KEY ("roleId") REFERENCES "dev"."Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."RolePermissions" ADD CONSTRAINT "FK_2c2887cb39b3141958851e6fbdc" FOREIGN KEY ("permissionId") REFERENCES "dev"."Permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dev"."workspace_users_roles_roles" ADD CONSTRAINT "FK_b2d66e2ecfac30b0194f6b0d470" FOREIGN KEY ("workspaceUsersId") REFERENCES "dev"."WorkspaceUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dev"."workspace_users_roles_roles" ADD CONSTRAINT "FK_11fdecc7d01cff567c28c443a23" FOREIGN KEY ("rolesId") REFERENCES "dev"."Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dev"."workspace_users_roles_roles" DROP CONSTRAINT "FK_11fdecc7d01cff567c28c443a23"`);
        await queryRunner.query(`ALTER TABLE "dev"."workspace_users_roles_roles" DROP CONSTRAINT "FK_b2d66e2ecfac30b0194f6b0d470"`);
        await queryRunner.query(`ALTER TABLE "dev"."RolePermissions" DROP CONSTRAINT "FK_2c2887cb39b3141958851e6fbdc"`);
        await queryRunner.query(`ALTER TABLE "dev"."RolePermissions" DROP CONSTRAINT "FK_5bc4baf52e29432973ac9ebf90a"`);
        await queryRunner.query(`ALTER TABLE "dev"."Permissions" DROP CONSTRAINT "FK_2d0e04a03f798614c9f4fec3c7b"`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" DROP CONSTRAINT "FK_66f91971da4caba7ce7facddda8"`);
        await queryRunner.query(`ALTER TABLE "dev"."WorkspaceUsers" DROP CONSTRAINT "FK_18465bea2ca39d0aeff88697589"`);
        await queryRunner.query(`DROP INDEX "dev"."IDX_11fdecc7d01cff567c28c443a2"`);
        await queryRunner.query(`DROP INDEX "dev"."IDX_b2d66e2ecfac30b0194f6b0d47"`);
        await queryRunner.query(`DROP TABLE "dev"."workspace_users_roles_roles"`);
        await queryRunner.query(`DROP TABLE "dev"."RolePermissions"`);
        await queryRunner.query(`DROP TABLE "dev"."Permissions"`);
        await queryRunner.query(`DROP TYPE "dev"."Permissions_action_enum"`);
        await queryRunner.query(`DROP TABLE "dev"."CaslSubjects"`);
        await queryRunner.query(`DROP TABLE "dev"."Workspaces"`);
        await queryRunner.query(`DROP TABLE "dev"."WorkspaceUsers"`);
        await queryRunner.query(`DROP TYPE "dev"."WorkspaceUsers_state_enum"`);
        await queryRunner.query(`DROP TABLE "dev"."Roles"`);
        await queryRunner.query(`DROP TYPE "dev"."Roles_name_enum"`);
        await queryRunner.query(`DROP TABLE "dev"."Users"`);
        await queryRunner.query(`DROP TYPE "dev"."Users_state_enum"`);
    }

}
