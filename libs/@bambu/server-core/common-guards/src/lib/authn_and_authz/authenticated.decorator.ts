import { SetMetadata } from '@nestjs/common';

export const AUTHENTICATED_KEY = 'roles_authenticated';
export const Authenticated = () => SetMetadata(AUTHENTICATED_KEY, true);
