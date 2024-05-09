import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export abstract class BrokerageIntegrationValuationsDomainBaseService {
  public abstract List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllResponseDto>;

  public abstract GetPortfolioValuationsForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationValuationListAllResponseDto>;
}
