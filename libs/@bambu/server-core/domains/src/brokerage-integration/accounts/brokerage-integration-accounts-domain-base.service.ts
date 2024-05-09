import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export abstract class BrokerageIntegrationAccountsDomainBaseService {
  public abstract List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto>;

  public abstract Get(
    requestId: string,
    tenantId: string,
    brokerageAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>;

  public abstract Create(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>;

  public abstract Close(
    requestId: string,
    tenantId: string,
    brokerageAccountId: string
  ): Promise<void>;

  public abstract GetAccountsForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationListAllAccountsResponseDto>;

  public abstract GetAccountForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>;

  public abstract CreateAccountForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationAccountMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto>;

  public abstract CloseAccountForParty(
    requestId: string,
    tenantId: string,
    brokeragePartyId: string,
    brokerageAccountId: string
  ): Promise<void>;
}
