import { IBrokerageIntegrationBankAccountDto } from './i-brokerage-integration-bank-account.dto';
import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';

export type IBrokerageIntegrationPartyBankAccountListAllResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<
    IBrokerageIntegrationBankAccountDto[]
  >;
