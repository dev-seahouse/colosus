import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export interface IBrokerageIntegrationBankAccountListAllQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  accountNumber?: string;
  clientReference?: string;
  partyId?: string;
  sortCode?: string;
}
