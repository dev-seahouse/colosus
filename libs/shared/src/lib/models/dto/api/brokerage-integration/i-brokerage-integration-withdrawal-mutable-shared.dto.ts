import { IBrokerageIntegrationWithdrawalSharedDto } from './i-brokerage-integration-withdrawal-shared.dto';

export interface IBrokerageIntegrationWithdrawalMutableSharedDto
  extends IBrokerageIntegrationWithdrawalSharedDto {
  closePortfolio: boolean;
}
