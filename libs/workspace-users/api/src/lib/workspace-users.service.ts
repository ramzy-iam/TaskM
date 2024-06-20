import crypto from 'crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { INVITATION_TOKEN_EXPIRY_TIME } from '@task-manager/core/constants';
import {
  UsersRepository,
  WorkspaceUser,
  WorkspaceUsersRepository,
} from '@task-manager/core/db';
import {
  DayjsHelper,
  EmailHelper,
  UtilsHelper,
} from '@task-manager/core/helpers';
import { StateUser } from '@task-manager/users/types';

@Injectable()
export class WorkspaceUsersService {
  private emailHelper: EmailHelper;

  constructor(
    private workspaceUserRepository: WorkspaceUsersRepository,
    private userRepository: UsersRepository
  ) {
    this.emailHelper = EmailHelper.getInstance();
  }

  create(workspaceUser: WorkspaceUser): Promise<WorkspaceUser> {
    return this.workspaceUserRepository.save(workspaceUser);
  }

  async update(
    id: number,
    workspaceUserUpdate: Partial<WorkspaceUser>,
    userConnectId?: number
  ) {
    const workspaceUser = await this.get(id);

    if (workspaceUser.userId === userConnectId)
      throw new ConflictException(
        'You cannot perform this operation because it concerns the account of the user performing the operation'
      );

    if (workspaceUserUpdate.roles && workspaceUserUpdate.roles?.length > 0) {
      if (workspaceUser.state !== StateUser.CONFIRMED)
        throw new ConflictException(
          "You cannot perform this operation because the user's account is not activated"
        );
      workspaceUser.buildRolesToSave([workspaceUserUpdate.roles[0].id]);
      return this.create(workspaceUser);
    }

    await this.workspaceUserRepository.update(
      { id },
      UtilsHelper.convertUndefinedToNull(workspaceUserUpdate)
    );

    return this.findOne(id);
  }

  async delete(id: number, userConnectId?: number) {
    const workspaceUser = await this.workspaceUserRepository.findOneOrFail({
      where: { id },
    });

    if (workspaceUser.userId === userConnectId)
      throw new ConflictException(
        'You cannot perform this operation because it concerns the account of the user performing the operation'
      );
    return this.workspaceUserRepository.softRemove(workspaceUser);
  }

  get(id: number): Promise<WorkspaceUser> {
    return this.workspaceUserRepository.findOneByOrFail({ id });
  }

  findAll(workspaceId?: number, userId?: number, email?: string) {
    const scope = this.workspaceUserRepository.scoped;
    if (userId) scope.filterByUserId(userId);
    if (email) scope.filterByEmail(email);
    if (workspaceId) scope.filterByWorkspaceId(workspaceId);
    return scope.joinWorkspace().joinRoles().getMany();
  }
  findOne(
    workspaceId?: number,
    userId?: number,
    tokenInvitation?: string,
    email?: string
  ) {
    const scope = this.workspaceUserRepository.scoped;
    if (userId) scope.filterByUserId(userId);
    if (tokenInvitation) scope.filterByTokenInvitation(tokenInvitation);
    if (email) scope.filterByEmail(email);
    if (workspaceId) scope.filterByWorkspaceId(workspaceId);
    return scope.joinWorkspace().joinRoles().getOne();
  }

  validationBeforeInvitation(workspaceUser: WorkspaceUser): boolean {
    if (workspaceUser) {
      if (workspaceUser.state !== StateUser.INVITED)
        throw new BadRequestException({
          message: `A user with the account ${workspaceUser.user.email} in the workspace ${workspaceUser.workspace.name} already exists`,
          code: 'WorkspaceUserAlreadyExistException',
          name: 'WorkspaceUserAlreadyExistException',
        });

      return true;
    }

    return false;
  }

  async createOrUpdateForInvitation(
    email: string,
    workspaceId: number,
    roleId: number
  ) {
    const workspaceUser = await this.findOne(
      workspaceId,
      undefined,
      undefined,
      email
    );
    const tokenInvitation = crypto.randomBytes(32).toString('hex');
    const tokenInvitationExpires = DayjsHelper.new()
      .add(INVITATION_TOKEN_EXPIRY_TIME, 'd')
      .toDate(); //3 days

    if (workspaceUser && this.validationBeforeInvitation(workspaceUser)) {
      workspaceUser.tokenInvitation = tokenInvitation;
      workspaceUser.tokenInvitationExpires = tokenInvitationExpires;
      await this.update(workspaceUser.id, {
        tokenInvitation,
        tokenInvitationExpires,
      });
      return workspaceUser;
    }
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new BadRequestException(
        `User not found with the email address ${email}`
      );

    const newWorkspaceUser = new WorkspaceUser(
      user.id,
      [roleId],
      tokenInvitation,
      tokenInvitationExpires,
      workspaceId,
      StateUser.INVITED
    );

    let workspaceUserSave: WorkspaceUser | null;
    workspaceUserSave = await this.create(newWorkspaceUser);
    if (!workspaceUserSave.workspace)
      workspaceUserSave = await this.findOne(
        workspaceId,
        undefined,
        undefined,
        email
      );

    if (workspaceUserSave) workspaceUserSave.user = user;

    return workspaceUserSave;
  }

  async sendMessageForInvitation(
    email: string,
    tokenInvitation: string,
    workspaceName: string,
    firstName?: string,
    lastName?: string
  ): Promise<any> {
    const invitationLink = `${
      process.env['NX_AUTH_PUBLIC_URL']
    }/auth/confirm-invitation?token=${tokenInvitation}&workspaceName=${encodeURIComponent(
      workspaceName
    )}`;

    return this.emailHelper.sendEmail({
      to: email,
      subject: `TaskM: Invitation to manage ${workspaceName}'s workspace`,
      html: `
      Hello ${firstName} ${lastName}
      Click to this link to join the workspace ${workspaceName} on TaskM, it's valid for ${INVITATION_TOKEN_EXPIRY_TIME} days: ${invitationLink}`,
    });
  }
}
