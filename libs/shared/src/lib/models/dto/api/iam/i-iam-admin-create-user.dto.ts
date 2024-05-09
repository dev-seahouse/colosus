import { IRoles } from '../i-roles.dto';

export interface IIamAdminCreateUserDto {
  username: string;
  email: string;
  password: string;
  groups: IRoles[];
}
