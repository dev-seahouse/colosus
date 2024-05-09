import { Tenant } from './tenant';
import { User } from './user';
import { OtpMode, OtpState } from '../../../index';

export class Otp {
  id: string;

  tenantId?: string;

  Tenant?: Tenant;

  userId?: string;

  User?: User;

  otp: string;

  purpose: string;

  mode: OtpMode;

  otpState: OtpState = OtpState.UNUSED;

  expiresAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  createdBy: string = 'unknown';

  createdAt: Date;

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  updatedBy: string = 'unknown';

  updatedAt: Date;
}
