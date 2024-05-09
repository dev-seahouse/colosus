import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export abstract class BrokerageIntegrationPortfoliosDomainBaseService {
  public abstract List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto>;

  public abstract GetPortfoliosForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllPortfoliosResponseDto>;

  public abstract Get(
    requestId: string,
    tenantId: string,
    brokeragePortfolioId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract GetPortfolioForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract Create(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract CreateForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract Update(
    requestId: string,
    tenantId: string,
    brokeragePortfolioId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract UpdateForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPortfolioDto>;

  public abstract Close(
    requestId: string,
    tenantId: string,
    brokeragePortfolioId: string
  ): Promise<void>;

  public abstract CloseForPartyAccount(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokeragePartyAccountId: string,
    brokeragePortfolioId: string
  ): Promise<void>;
}
