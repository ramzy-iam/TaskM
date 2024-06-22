import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@TaskM/core/db';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;
    const workspaceId = req.params?.workspaceId;

    const workspaceUser = user?.workspaceUsers?.find(
      (uc) => uc?.workspaceId === +workspaceId
    );

    return { ...user, currentWorkspace: workspaceUser };
  }
);
