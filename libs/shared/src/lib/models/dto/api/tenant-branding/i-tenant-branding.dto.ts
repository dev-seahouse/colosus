import { ITenantBrandingScalarsDto } from './i-tenant-branding-scalars.dto';

export interface ITenantBrandingDto extends ITenantBrandingScalarsDto {
  logoUrl: string | null;
}
