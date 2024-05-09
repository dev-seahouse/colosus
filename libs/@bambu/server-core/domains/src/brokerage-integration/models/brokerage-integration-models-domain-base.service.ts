import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export abstract class BrokerageIntegrationModelsDomainBaseService {
  public abstract List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDtoListAllResponseDto>;

  public abstract Get(
    requestId: string,
    tenantId: string,
    brokerageModelId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationModelPortfolioDto>;
}
