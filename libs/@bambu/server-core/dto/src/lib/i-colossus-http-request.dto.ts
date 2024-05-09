import type { Request } from 'express';
import type { IServerCoreIamClaimsDto } from './i-server-core-iam-claims.dto';

export interface IColossusHttpRequestDto extends Request {
  claims: IServerCoreIamClaimsDto;
}
