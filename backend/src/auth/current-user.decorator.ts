import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUser = { userId: number; email: string };

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser | null => {
  const req = ctx.switchToHttp().getRequest();
  return req.user ?? null;
});
