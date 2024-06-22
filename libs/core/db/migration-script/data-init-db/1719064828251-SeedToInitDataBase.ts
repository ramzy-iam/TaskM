import { MigrationInterface, QueryRunner } from "typeorm";
import { CaslSubject, Permission, Role, RolePermission } from '../../src';
import { DataRolesToInitDB } from './role.data.init-db';
import { DataSubjectsToInitDB } from './casl-subjects.data.init-db';
import { DataPermissionsToInitDB } from './permission.data.init-db';
import { DataRolePermissionsToInitDB } from './role-permission.data.init-db';

export class SeedToInitDataBase1719064828251 implements MigrationInterface {
    name = 'SeedToInitDataBase1719064828251';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.manager.save(
        queryRunner.manager.create(Role, DataRolesToInitDB)
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(CaslSubject, DataSubjectsToInitDB)
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(Permission, DataPermissionsToInitDB)
      );
      await queryRunner.manager.save(
        queryRunner.manager.create(RolePermission, DataRolePermissionsToInitDB)
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.manager.clear<Role>(Role);
      await queryRunner.manager.clear<CaslSubject>(CaslSubject);
      await queryRunner.manager.clear<Permission>(Permission);
      await queryRunner.manager.clear<RolePermission>(RolePermission);
    }

}
