import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@contexts/auth/infrastructure/strategies/jwt.strategy';

export const GetUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();
    const user = request.user;

    if (!user) return null;

    if (data) return user[data];

    return user;
  },
);
