import { BrokerageIntegrationWithdrawalStatusEnum } from '../../../../enums';
import { IBrokerageIntegrationWithdrawalSharedDto } from './i-brokerage-integration-withdrawal-shared.dto';

export interface IBrokerageIntegrationWithdrawalDto
  extends IBrokerageIntegrationWithdrawalSharedDto {
  status: BrokerageIntegrationWithdrawalStatusEnum;
  reason: string | null;
  requestedAt: Date | string;
  id: string;
}
