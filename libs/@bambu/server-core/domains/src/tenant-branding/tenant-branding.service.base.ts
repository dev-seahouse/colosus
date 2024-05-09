import { IColossusTrackingDto } from '@bambu/server-core/dto';

export interface ITenantBrandingScalarsDto {
  headerBgColor: string;
  brandColor: string;
  tradeName: string;
}

export interface ITenantBrandingDto extends ITenantBrandingScalarsDto {
  logoUrl: string | null;
}

export interface ISetBrandingInputDto extends ITenantBrandingScalarsDto {
  tenantId: string;
  tracking: IColossusTrackingDto;
  trackPlatformSetupProgress: boolean;
}

export abstract class TenantBrandingServiceBase {
  abstract UploadLogo(params: {
    tenantId: string;
    filePath: string;
    originalFilename: string;
    contentType: string;
    tracking: IColossusTrackingDto;
  }): Promise<string>;

  abstract DeleteLogo(params: {
    tenantId: string;
    tracking: IColossusTrackingDto;
  }): Promise<void>;

  abstract SetBranding(params: ISetBrandingInputDto): Promise<void>;

  abstract GetBranding({
    tenantId,
  }: {
    tenantId: string;
  }): Promise<ITenantBrandingDto | null>;

  abstract InitializeBranding({
    tenantId,
  }: {
    tenantId: string;
  }): Promise<void>;
}
