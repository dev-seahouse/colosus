import { IServerCoreIamClaimsDto } from '@bambu/server-core/dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Claims = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.claims as IServerCoreIamClaimsDto | undefined;
  }
);
