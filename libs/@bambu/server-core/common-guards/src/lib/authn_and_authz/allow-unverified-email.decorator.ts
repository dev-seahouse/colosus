import { SetMetadata } from '@nestjs/common';

export const ALLOW_EMAIL_UNVERIFIED_KEY = 'roles_allow_unverified_email';
export const AllowEmailUnverified = () =>
  SetMetadata(ALLOW_EMAIL_UNVERIFIED_KEY, true);
