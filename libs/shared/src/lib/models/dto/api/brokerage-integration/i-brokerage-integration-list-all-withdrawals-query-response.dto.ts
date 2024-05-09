import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationWithdrawalDto } from './i-brokerage-integration-withdrawal.dto';

export type IBrokerageIntegrationListAllWithdrawalsQueryResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationWithdrawalDto[]
  >;
