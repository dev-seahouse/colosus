import { BrokerageIntegrationWithdrawalTypeEnum } from '../../../../enums';
import { IBrokerageIntegrationMoneyDto } from './i-brokerage-integration-money.dto';

export interface IBrokerageIntegrationWithdrawalSharedDto {
  type: BrokerageIntegrationWithdrawalTypeEnum;
  bankAccountId: string;
  consideration: IBrokerageIntegrationMoneyDto;
  reference?: string | null;
}
