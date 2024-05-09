import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export interface IGetTenantIdsForBrokerageParamsDto {
  pageIndex: number;
  pageSize: number;
}

export abstract class BrokerageIntegrationAuthenticationDomainBaseService {
  abstract GetAuthenticationTokenFromCache(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto | null>;

  abstract InitializeAuthenticationToken(
    requestId: string,
    tenantId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageAuthenticationTokenDto>;

  abstract GetTenantIdsForBrokerage(
    requestId: string,
    input: IGetTenantIdsForBrokerageParamsDto
  ): Promise<string[]>;
}
