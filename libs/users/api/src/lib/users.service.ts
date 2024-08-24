import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StateUser, UserListFilter } from '@TaskM/users/types';
import { User, UsersRepository, Workspace } from '@TaskM/core/db';
import { DayjsHelper, UtilsHelper } from '@TaskM/core/helpers';
import { CreateUserDto } from '@TaskM/core/dto';
import { WorkspaceUsersService } from '@TaskM/workspace-users/api';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private workspaceUserService: WorkspaceUsersService,
  ) {}

  create(userDto: CreateUserDto) {
    const newUser = this.usersRepository.create(userDto);
    return this.usersRepository.save(newUser);
  }

  findAll({ name, email }: UserListFilter) {
    const query = this.usersRepository.scoped;

    if (name) {
      query.filterByName(name);
    }

    if (email) {
      query.filterByEmail(email);
    }

    return query.getMany();
  }

  findOne({ email, id, token }: UserListFilter) {
    const query = this.usersRepository.scoped;

    if (id) {
      query.filterById(id);
    }

    if (email) {
      query.filterByEmail(email);
    }

    if (token) {
      query.filterByVerificationToken(token);
    }

    return query.getOne();
  }

  get(id: number) {
    return this.usersRepository.findOneByOrFail({ id });
  }

  async delete(id: number) {
    await this.get(id);
    return this.usersRepository.softDelete({ id });
  }

  async update(id: string, updatedUser: Partial<User>) {
    await this.get(id);
    return this.usersRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(updatedUser),
    );
  }

  async updateActiveWorkspace(
    userId: number,
    activeWorkspaceId: number,
  ): Promise<void> {
    this.update(userId, { activeWorkspaceId });
  }

  async confirmInvitationUser(tokenInvitation: string) {
    const guestWorkspaceUser = await this.workspaceUserService.findOne(
      undefined,
      undefined,
      tokenInvitation,
      undefined,
    );
    if (!guestWorkspaceUser)
      throw new BadRequestException(`Invalid invitation link`);
    if (DayjsHelper.new().isAfter(guestWorkspaceUser.tokenInvitationExpires))
      throw new BadRequestException(
        `Invitation to user ${guestWorkspaceUser.user.email} expired`,
      );
    if (
      guestWorkspaceUser.state !== StateUser.CONFIRMED &&
      guestWorkspaceUser.state !== StateUser.INVITED
    )
      throw new BadRequestException({
        message: `User is already ${guestWorkspaceUser.state}.`,
        code: 'StateUserException',
        name: 'StateUserException',
      });

    await this.workspaceUserService.update(guestWorkspaceUser.id, {
      state: StateUser.CONFIRMED,
      tokenInvitation: undefined,
      tokenInvitationExpires: undefined,
    });

    return {
      message: `Joined ${guestWorkspaceUser.workspace.name}'s workspace successfully`,
    };
  }

  private async inviteUser(email: string, workspaceId: number, roleId: number) {
    const workspaceUser =
      await this.workspaceUserService.createOrUpdateForInvitation(
        email,
        workspaceId,
        roleId,
      );

    if (!workspaceUser) throw new NotFoundException(`User not found`);

    await this.workspaceUserService.sendMessageForInvitation(
      email,
      workspaceUser.tokenInvitation as string,
      workspaceUser.workspace.name,
      workspaceUser.user.lastName,
      workspaceUser.user.firstName,
    );
    return { message: `Invitation sent successfully to ${email}` };
  }

  async inviteUsers(workspaceId: number, emails: string[], roleId: number) {
    const results = await Promise.allSettled(
      emails?.map(async (email) => {
        return this.inviteUser(email, workspaceId, roleId);
      }),
    );

    const errors = results.filter((o) => o.status === 'rejected');
    if (errors.length > 0) {
      let messageError = '';
      errors.forEach((error) => {
        messageError += `${(error as any).reason?.message}, `;
      });
      throw new InternalServerErrorException(messageError);
    }
    return results;
  }

  async getUserInfo(userId: number) {
    const user = await this.get(userId);
    const workspaceUsers = await this.workspaceUserService.findAll(
      undefined,
      userId,
    );

    let userActiveWorkspace: Workspace | undefined;
    if (workspaceUsers.length) {
      userActiveWorkspace = workspaceUsers
        .map((workspaceUser) => workspaceUser.workspace)
        .find((w) => w.id === user.activeWorkspaceId);
      if (!userActiveWorkspace) {
        await this.updateActiveWorkspace(
          user.id,
          workspaceUsers[0].workspace.id,
        );
        userActiveWorkspace = workspaceUsers[0].workspace;
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },

      activeWorkspace: {
        ...userActiveWorkspace,
        workspaceUsers: await this.workspaceUserService.findAll(
          userActiveWorkspace?.id,
        ),
      },
      workspaces: await Promise.all(
        workspaceUsers.map(async (uc) => {
          const workspace = uc.workspace;
          return {
            id: workspace.id,
            name: workspace.name,
            workspaceUsers: await this.workspaceUserService.findAll(
              workspace.id,
            ),
          };
        }),
      ),
    };
  }
}
