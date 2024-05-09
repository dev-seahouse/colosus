import {
  IBrokerageIntegrationListAllWithdrawalsQueryParamsDto,
  IBrokerageIntegrationListAllWithdrawalsQueryResponseDto,
  IBrokerageIntegrationWithdrawalDto,
  IBrokerageIntegrationWithdrawalMutableDto,
} from '@bambu/shared';

export abstract class BrokerageIntegrationWithdrawalsDomainBaseService {
  public abstract List(
    requestId: string,
    tenantId: string,
    queryParams: IBrokerageIntegrationListAllWithdrawalsQueryParamsDto
  ): Promise<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto>;
  public abstract Get(
    requestId: string,
    tenantId: string,
    brokerageWithdrawalId: string
  ): Promise<IBrokerageIntegrationWithdrawalDto>;
  public abstract Create(
    requestId: string,
    tenantId: string,
    payload: IBrokerageIntegrationWithdrawalMutableDto,
    idempotencyKey?: string
  ): Promise<IBrokerageIntegrationWithdrawalDto>;
}
