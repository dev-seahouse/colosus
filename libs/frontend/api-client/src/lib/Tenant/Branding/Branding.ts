import type { TenantBrandingDto } from '@bambu/shared';
import TenantBasePrivateApi from '../_Base/Base';

export type TenantGetTenantBrandingResponseDto =
  TenantBrandingDto.ITenantBrandingDto;

export type TenantUpdateTenantBrandingRequestDto =
  TenantBrandingDto.ITenantBrandingScalarsDto;

export class TenantBrandingApi extends TenantBasePrivateApi {
  constructor(private readonly apiPath = '/branding') {
    super();
  }

  public async getTenantBranding() {
    return this.axios.get<TenantGetTenantBrandingResponseDto>(this.apiPath);
  }

  /**
   * Set branding info for a tenant.
   * - {@link http://localhost:9000/openapi#/Branding/SetTenantBranding}
   */
  public async updateTenantBranding(req: TenantUpdateTenantBrandingRequestDto) {
    return this.axios.patch(this.apiPath, req);
  }

  /**
   * Upload a Logo for use by a tenant.
   * - {@link http://localhost:9000/openapi#/Branding/UploadTenantLogo}
   */
  public async uploadLogo(req: FormData) {
    return this.axios.post(`${this.apiPath}/logo`, req, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Delete the uploaded logo associated with the tenant.
   * - {@link http://localhost:9000/openapi#/Branding/DeleteTenantLogo}
   */
  public async deleteLogo() {
    return this.axios.delete(`${this.apiPath}/logo`);
  }
}

export default TenantBrandingApi;
