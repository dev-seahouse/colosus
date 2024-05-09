import type { TenantBrandingDto } from '@bambu/shared';
import ConnectAdvisorBasePrivateApi from '../_Base/Base';

export type ConnectAdvisorGetBrandingResponseDto =
  TenantBrandingDto.ITenantBrandingDto;

export class ConnectAdvisorBrandingApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/branding') {
    super();
  }

  /**
   * Returns branding info for a tenant..
   * - {@link http://localhost:9000/openapi#/Connect/GetTenantBranding}.
   */
  public async getTenantBranding() {
    return await this.axios.get<ConnectAdvisorGetBrandingResponseDto>(
      `${this.apiPath}`
    );
  }
}
export default ConnectAdvisorBrandingApi;
