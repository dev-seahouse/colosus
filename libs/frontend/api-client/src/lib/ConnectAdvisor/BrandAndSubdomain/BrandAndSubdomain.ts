import type { ConnectTenantDto } from '@bambu/shared';
import ConnectAdvisorBasePrivateApi from '../_Base/Base';

export type ConnectAdvisorGetBrandAndSubdomainResponseDto =
  ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto;

export type ConnectAdvisorUpdateBrandAndSubdomainRequestDto =
  ConnectTenantDto.IConnectTenantTradeNameAndSubdomainDto;

export class ConnectAdvisorBrandAndSubdomainApi extends ConnectAdvisorBasePrivateApi {
  constructor(private readonly apiPath = '/brand-and-subdomain') {
    super();
  }

  /**
   * Returns the brand name and subdomain for a tenant.
   * - {@link http://localhost:9000/openapi#/Connect%20Advisor/GetTradeNameAndSubdomain}.
   */
  public async getSubdomain() {
    return await this.axios.get<ConnectAdvisorGetBrandAndSubdomainResponseDto>(
      `${this.apiPath}`
    );
  }

  /**
   * Set the brand name and subdomain for a tenant.
   * - {@link http://localhost:9000/openapi#/Connect%20Advisor/SetTradeNameAndSubdomain}.
   */
  public async updateBrandAndSubdomain(
    req: ConnectAdvisorUpdateBrandAndSubdomainRequestDto
  ) {
    return await this.axios.patch(`${this.apiPath}`, req);
  }
}
export default ConnectAdvisorBrandAndSubdomainApi;
