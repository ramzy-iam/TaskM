import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722351332634 implements MigrationInterface {
    name = 'Migration1722351332634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "taskm"."Roles_name_enum" AS ENUM('Admin', 'Linguist', 'Simple User')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Roles" ("id" SERIAL NOT NULL, "name" "taskm"."Roles_name_enum" DEFAULT 'Simple User', CONSTRAINT "UQ_8eadedb8470c92966389ecc2165" UNIQUE ("name"), CONSTRAINT "PK_efba48c6a0c7a9b6260f771b165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "taskm"."WorkspaceUsers_state_enum" AS ENUM('UNCONFIRMED', 'CONFIRMED', 'INVITED', 'SUSPENDED', 'EXPIRED', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "taskm"."WorkspaceUsers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "workspaceId" uuid NOT NULL, "tokenInvitation" character varying, "tokenInvitationExpires" TIMESTAMP WITH TIME ZONE, "state" "taskm"."WorkspaceUsers_state_enum" NOT NULL DEFAULT 'CONFIRMED', "userId" uuid NOT NULL, CONSTRAINT "PK_94f6f5026059fab49269d3648fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "taskm"."Workspaces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "isVisible" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_70ae81ece915f7f08f436d6c299" UNIQUE ("name"), CONSTRAINT "PK_35160e1c18ee262230a1848e5fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "taskm"."Users_state_enum" AS ENUM('UNCONFIRMED', 'CONFIRMED', 'INVITED', 'SUSPENDED', 'EXPIRED', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "token" character varying, "tokenExpires" TIMESTAMP WITH TIME ZONE, "passwordResetToken" character varying, "passwordResetExpires" TIMESTAMP WITH TIME ZONE, "state" "taskm"."Users_state_enum" NOT NULL DEFAULT 'UNCONFIRMED', "activeWorkspaceId" integer, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "taskm"."CaslSubjects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c6022cacc22e4ade0583b68b74d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "taskm"."Permissions_action_enum" AS ENUM('manage', 'create', 'read', 'update', 'delete', 'view', 'filter', 'search', 'cancel', 'approve', 'invite', 'remove')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Permissions" ("id" SERIAL NOT NULL, "subjectId" integer NOT NULL, "action" "taskm"."Permissions_action_enum" NOT NULL, "conditions" jsonb, CONSTRAINT "PK_e83fa8a46bd5a3bfaa095d40812" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "taskm"."RolePermissions" ("id" SERIAL NOT NULL, "roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_29cf5edaa365f1e090b95eb6708" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "taskm"."Clients_currency_enum" AS ENUM('USD', 'EURO', 'CAD', 'XAF')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Clients_paymentmethod_enum" AS ENUM('Payonneer', 'PayPal', 'Bank', 'OM', 'MoMo', 'Cash')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "code" character varying NOT NULL, "paymentDueDays" integer NOT NULL, "billingEmailAddress" character varying NOT NULL, "billingPeriod" character varying NOT NULL, "currency" "taskm"."Clients_currency_enum" NOT NULL, "paymentMethod" "taskm"."Clients_paymentmethod_enum" NOT NULL, CONSTRAINT "UQ_ddb0ff82bc649f4594ed5fb7a2c" UNIQUE ("code"), CONSTRAINT "PK_8dadaa0dc6305d95e1d1a6b9544" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_status_enum" AS ENUM('Delivered & waiting QA', 'Completed', 'Not Started', 'Delivered & closed', 'In progress', 'Cancelled', 'On Hold')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_tasktype_enum" AS ENUM('TRA', 'EDIT', 'PROOF', 'TEP', 'TCREA', 'TRANS', 'MPTE', 'SUBT', 'DTP', 'VO')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_lang_enum" AS ENUM('Fr', 'En', 'En-Fr', 'EnUK-FrFR', 'EnUK-FrCA', 'EnUS-FrFR', 'EnUS-FrCA', 'Fr-En', 'FrFR-EnUK', 'FrFR-EnUS', 'FrCA-EnUK', 'FrCA-EnUS', 'FrCA-EnCA', 'Spa-Fr', 'Spa-FrFR', 'Spa-FrCA', 'Ger-Fr', 'Ger-FrFR', 'Ger- FrCA')`);
        await queryRunner.query(`CREATE TYPE "taskm"."Projects_unit_enum" AS ENUM('word', 'page', 'minute', 'hour')`);
        await queryRunner.query(`CREATE TABLE "taskm"."Projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, "clientPM" character varying, "status" "taskm"."Projects_status_enum" NOT NULL DEFAULT 'Not Started', "taskType" "taskm"."Projects_tasktype_enum" NOT NULL, "lang" "taskm"."Projects_lang_enum" NOT NULL, "poId" character varying NOT NULL, "internalPoId" character varying NOT NULL, "count" integer NOT NULL, "reference" character varying NOT NULL, "rate" integer NOT NULL, "unit" "taskm"."Projects_unit_enum" NOT NULL, "clientId" uuid NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE NOT NULL, "internalDeadline" TIMESTAMP WITH TIME ZONE NOT NULL, "receivedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "deliveredAt" TIMESTAMP WITH TIME ZONE, "invoicedAt" TIMESTAMP WITH TIME ZONE, "expectedPaidAt" TIMESTAMP WITH TIME ZONE, "paidAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_8a95a0fdd9fa94699ac15218cd3" UNIQUE ("internalPoId"), CONSTRAINT "PK_b25c37f2cdf0161b4f10ed3121c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "taskm"."workspace_users_roles_roles" ("workspaceUsersId" uuid NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_b45b0d3575834fc65bedf96d8cc" PRIMARY KEY ("workspaceUsersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b2d66e2ecfac30b0194f6b0d47" ON "taskm"."workspace_users_roles_roles" ("workspaceUsersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_11fdecc7d01cff567c28c443a2" ON "taskm"."workspace_users_roles_roles" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "taskm"."WorkspaceUsers" ADD CONSTRAINT "FK_18465bea2ca39d0aeff88697589" FOREIGN KEY ("workspaceId") REFERENCES "taskm"."Workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."WorkspaceUsers" ADD CONSTRAINT "FK_66f91971da4caba7ce7facddda8" FOREIGN KEY ("userId") REFERENCES "taskm"."Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."Permissions" ADD CONSTRAINT "FK_2d0e04a03f798614c9f4fec3c7b" FOREIGN KEY ("subjectId") REFERENCES "taskm"."CaslSubjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."RolePermissions" ADD CONSTRAINT "FK_5bc4baf52e29432973ac9ebf90a" FOREIGN KEY ("roleId") REFERENCES "taskm"."Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."RolePermissions" ADD CONSTRAINT "FK_2c2887cb39b3141958851e6fbdc" FOREIGN KEY ("permissionId") REFERENCES "taskm"."Permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" ADD CONSTRAINT "FK_06f7251c92cc0fc55fd6da112db" FOREIGN KEY ("clientId") REFERENCES "taskm"."Clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "taskm"."workspace_users_roles_roles" ADD CONSTRAINT "FK_b2d66e2ecfac30b0194f6b0d470" FOREIGN KEY ("workspaceUsersId") REFERENCES "taskm"."WorkspaceUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "taskm"."workspace_users_roles_roles" ADD CONSTRAINT "FK_11fdecc7d01cff567c28c443a23" FOREIGN KEY ("rolesId") REFERENCES "taskm"."Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "taskm"."workspace_users_roles_roles" DROP CONSTRAINT "FK_11fdecc7d01cff567c28c443a23"`);
        await queryRunner.query(`ALTER TABLE "taskm"."workspace_users_roles_roles" DROP CONSTRAINT "FK_b2d66e2ecfac30b0194f6b0d470"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Projects" DROP CONSTRAINT "FK_06f7251c92cc0fc55fd6da112db"`);
        await queryRunner.query(`ALTER TABLE "taskm"."RolePermissions" DROP CONSTRAINT "FK_2c2887cb39b3141958851e6fbdc"`);
        await queryRunner.query(`ALTER TABLE "taskm"."RolePermissions" DROP CONSTRAINT "FK_5bc4baf52e29432973ac9ebf90a"`);
        await queryRunner.query(`ALTER TABLE "taskm"."Permissions" DROP CONSTRAINT "FK_2d0e04a03f798614c9f4fec3c7b"`);
        await queryRunner.query(`ALTER TABLE "taskm"."WorkspaceUsers" DROP CONSTRAINT "FK_66f91971da4caba7ce7facddda8"`);
        await queryRunner.query(`ALTER TABLE "taskm"."WorkspaceUsers" DROP CONSTRAINT "FK_18465bea2ca39d0aeff88697589"`);
        await queryRunner.query(`DROP INDEX "taskm"."IDX_11fdecc7d01cff567c28c443a2"`);
        await queryRunner.query(`DROP INDEX "taskm"."IDX_b2d66e2ecfac30b0194f6b0d47"`);
        await queryRunner.query(`DROP TABLE "taskm"."workspace_users_roles_roles"`);
        await queryRunner.query(`DROP TABLE "taskm"."Projects"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_unit_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_lang_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_tasktype_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "taskm"."Clients"`);
        await queryRunner.query(`DROP TYPE "taskm"."Clients_paymentmethod_enum"`);
        await queryRunner.query(`DROP TYPE "taskm"."Clients_currency_enum"`);
        await queryRunner.query(`DROP TABLE "taskm"."RolePermissions"`);
        await queryRunner.query(`DROP TABLE "taskm"."Permissions"`);
        await queryRunner.query(`DROP TYPE "taskm"."Permissions_action_enum"`);
        await queryRunner.query(`DROP TABLE "taskm"."CaslSubjects"`);
        await queryRunner.query(`DROP TABLE "taskm"."Users"`);
        await queryRunner.query(`DROP TYPE "taskm"."Users_state_enum"`);
        await queryRunner.query(`DROP TABLE "taskm"."Workspaces"`);
        await queryRunner.query(`DROP TABLE "taskm"."WorkspaceUsers"`);
        await queryRunner.query(`DROP TYPE "taskm"."WorkspaceUsers_state_enum"`);
        await queryRunner.query(`DROP TABLE "taskm"."Roles"`);
        await queryRunner.query(`DROP TYPE "taskm"."Roles_name_enum"`);
    }

}
