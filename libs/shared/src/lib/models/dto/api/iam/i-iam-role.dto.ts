export interface IIamRoleDto {
  description: string;
  name: string;
  isSuperRole: boolean;
  isDefault: boolean;
}

const _vendorAdminRole: IIamRoleDto = {
  description: 'Vendor administrator role',
  name: 'Vendor-Admin',
  isSuperRole: true,
  isDefault: false,
};

export const DEFAULT_VENDOR_ADMIN_ROLE: Readonly<IIamRoleDto> =
  _vendorAdminRole;

const _vendeeAdminRole: IIamRoleDto = {
  description: 'Vendee administrator role',
  name: 'Vendee-Admin',
  isSuperRole: true,
  isDefault: false,
};

export const DEFAULT_VENDEE_ADMIN_ROLE: Readonly<IIamRoleDto> =
  _vendeeAdminRole;

const _advisorRole: IIamRoleDto = {
  description: 'Advisor role',
  name: 'Advisor',
  isSuperRole: false,
  isDefault: false,
};

export const DEFAULT_ADVISOR_ROLE: Readonly<IIamRoleDto> = _advisorRole;

const _defaultSuperUserRoles: IIamRoleDto[] = [
  DEFAULT_VENDOR_ADMIN_ROLE,
  DEFAULT_VENDEE_ADMIN_ROLE,
  DEFAULT_ADVISOR_ROLE,
];

Object.freeze(_defaultSuperUserRoles);

const _investorRole: IIamRoleDto = {
  description: 'Investor role',
  name: 'Investor',
  isSuperRole: false,
  isDefault: false,
};

export const DEFAULT_INVESTOR_ROLE: Readonly<IIamRoleDto> = _investorRole;

const _defaultRoles: IIamRoleDto[] = [_investorRole, ..._defaultSuperUserRoles];

export const DEFAULT_SUPER_USER_ROLES: ReadonlyArray<IIamRoleDto> =
  _defaultSuperUserRoles;

export const DEFAULT_ROLES: ReadonlyArray<IIamRoleDto> = _defaultRoles;
