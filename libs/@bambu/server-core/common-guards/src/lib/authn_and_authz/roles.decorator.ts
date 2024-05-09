import { IRoles } from '@bambu/shared';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// TODO: add a schema for rolese
export const Roles = (...roles: IRoles[]) => SetMetadata(ROLES_KEY, roles);
