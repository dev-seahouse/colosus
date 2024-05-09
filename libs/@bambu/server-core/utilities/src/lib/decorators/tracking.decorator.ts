import {
  IColossusHttpRequestDto,
  IColossusTrackingDto,
} from '@bambu/server-core/dto';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as crypto from 'crypto';

export const Tracking = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IColossusTrackingDto => {
    const request = ctx.switchToHttp().getRequest() as IColossusHttpRequestDto;
    return {
      requestId: crypto.randomUUID(),
      requesterId: request.claims?.sub,
      // TODO: implement setting applicationId
    };
  }
);
