import { IBrokerageIntegrationWithdrawalMutableSharedDto } from './i-brokerage-integration-withdrawal-mutable-shared.dto';

export interface IColossusWithdrawalMutableDto
  extends IBrokerageIntegrationWithdrawalMutableSharedDto {
  goalId: string;
}
