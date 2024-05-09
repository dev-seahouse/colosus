import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export abstract class BrokerageIntegrationTransactionsDomainBaseService {
  public abstract List(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllResponseDto>;

  public abstract Get(
    requestId: string,
    tenantId: string,
    transactionId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionDto>;
}
