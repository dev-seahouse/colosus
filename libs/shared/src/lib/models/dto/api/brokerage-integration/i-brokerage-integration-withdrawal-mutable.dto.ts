import { IBrokerageIntegrationWithdrawalMutableSharedDto } from './i-brokerage-integration-withdrawal-mutable-shared.dto';

export interface IBrokerageIntegrationWithdrawalMutableDto
  extends IBrokerageIntegrationWithdrawalMutableSharedDto {
  portfolioId: string;
  // This field is deprecated and will be removed in the future
  // feesAmount: IBrokerageIntegrationMoneyDto;
}
