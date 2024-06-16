import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@task-manager/core/db';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user: User = req.user;

    return user;
  }
);
