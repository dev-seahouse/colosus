import TransactInvestorV2BaseApi from '../../../_Base/V2Base';
import type {
  InvestorBrokerageIntegrationListAllQueryParamsBaseDto,
  InvestorBrokerageIntegrationPartyBankAccountListAllResponseDto,
} from '../Brokerage.types';

export class TransactInvestorAuthenticatedBrokerageBankAccountsV2Api extends TransactInvestorV2BaseApi {
  constructor(
    private readonly apiPath = '/authenticated/brokerage/bank-accounts'
  ) {
    super();
  }

  /**
   * Retrieves the list of bank accounts associated with the investor.
   * http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetBankAccountsPaged
   */
  public async getBankAccountsPaged(
    args: InvestorBrokerageIntegrationListAllQueryParamsBaseDto
  ) {
    return this.axios.get<InvestorBrokerageIntegrationPartyBankAccountListAllResponseDto>(
      this.apiPath,
      {
        params: args,
      }
    );
  }
}

export default TransactInvestorAuthenticatedBrokerageBankAccountsV2Api;
