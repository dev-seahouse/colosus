import { createParamDecorator } from '@nestjs/common';
import * as crypto from 'crypto';

export const RequestId = createParamDecorator(() => {
  const requestId: string = crypto.randomUUID();
  return requestId;
});
