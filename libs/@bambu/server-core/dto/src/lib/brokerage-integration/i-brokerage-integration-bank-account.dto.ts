import { IBrokerageIntegrationBankAccountMutableDto } from './i-brokerage-integration-bank-account-mutable.dto';

export interface IBrokerageIntegrationBankAccountDto
  extends IBrokerageIntegrationBankAccountMutableDto {
  id: string;
  addedAt: string;
  deactivatedAt?: string | null;
}
