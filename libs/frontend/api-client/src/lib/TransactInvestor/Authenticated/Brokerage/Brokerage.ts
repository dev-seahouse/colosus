import type {
  InvestorBrokerageAccountDto,
  InvestorBrokerageAccountMutableDto,
  InvestorBrokerageAddressCreationDto,
  InvestorBrokerageAddressDto,
  InvestorBrokerageBankAccForPartyItem,
  InvestorBrokerageCancelDirectDebitSubscriptionRequestDto,
  InvestorBrokerageCreateBankAccountForPartyRequestDto,
  InvestorBrokerageCreateBankAccountForPartyResponseDto,
  InvestorBrokerageCreateDirectDebitMandateRequestDto,
  InvestorBrokerageCreateDirectDebitMandateResponseDto,
  InvestorBrokerageCreationDto,
  InvestorBrokerageDirectDebitMandateCancelRequestDto,
  InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto,
  InvestorBrokerageDirectDebitMandateGetPdfRequestDto,
  InvestorBrokerageGetBankAccountByIdRequestDto,
  InvestorBrokerageGetBankAccountsForPartyResponseDto,
  InvestorBrokerageGetDirectDebitMandatesResponseDto,
  InvestorBrokerageGetNextPossiblePaymentRequestDto,
  InvestorBrokerageGetNextPossiblePaymentResponseDto,
  InvestorBrokeragePartyDto,
  InvestorBrokerageUkDirectDebitCreatePaymentReqDto,
  InvestorBrokerageUkDirectDebitCreatePaymentResDto,
  InvestorBrokerageUkDirectDebitCreateSubscriptionReqDto,
  InvestorBrokerageUkDirectDebitCreateSubscriptionResDto,
  InvestorBrokerageUkDirectDebitPaymentListAllResponseDto,
  InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto,
  InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto,
  InvestorBrokerageWithdrawalRequestDto,
  InvestorBrokerageWithdrawalResponseDto,
} from './Brokerage.types';
import TransactInvestorBaseApi from '../../_Base/Base';

// request and response for both submitKycToBrokerage and getBrokerageProfileForInvestor
export type InvestorBrokerageApiRequestDto = {
  party: Omit<InvestorBrokerageCreationDto, 'clientReference'>;
  address: Omit<
    InvestorBrokerageAddressCreationDto,
    'partyId' | 'clientReference'
  >;
  account: Omit<
    InvestorBrokerageAccountMutableDto,
    'clientReference' | 'owner' | 'name'
  >;
};

export type InvestorBrokerageApiResponseDto = {
  party: InvestorBrokeragePartyDto;
  addresses: InvestorBrokerageAddressDto[];
  accounts: InvestorBrokerageAccountDto[];
};

export class TransactInvestorAuthenticatedBrokerageApi extends TransactInvestorBaseApi {
  constructor(private readonly apiPath = 'authenticated/brokerage') {
    super();
  }

  /**
   * Submit KYC information to the brokerage.
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_SubmitKycToBrokerage/}
   * */
  public async submitKycToBrokerage(args: InvestorBrokerageApiRequestDto) {
    return this.axios.post<InvestorBrokerageApiResponseDto>(
      this.apiPath + '/accounts',
      args
    );
  }
  /**
   * Get brokerage profile for investor.
   * - {@Link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetBrokerageProfileForInvestor}
   */
  public async getBrokerageProfileForInvestor() {
    return this.axios.get<InvestorBrokerageApiResponseDto>(
      this.apiPath + '/accounts'
    );
  }

  /**
   * Create a bank account for a party.
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_CreateBankAccountForParty}
   */
  public async createBankAccountForParty(
    args: InvestorBrokerageCreateBankAccountForPartyRequestDto
  ) {
    return this.axios.post<InvestorBrokerageCreateBankAccountForPartyResponseDto>(
      this.apiPath + '/bank-accounts',
      args
    );
  }

  /**
   * Get bank accounts for a party.
   * - {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetBankAccounts}
   */
  public async getBankAccounts() {
    return this.axios.get<InvestorBrokerageGetBankAccountsForPartyResponseDto>(
      this.apiPath + '/bank-accounts'
    );
  }

  /**
   * Get bank account by id.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetBankAccountById}
   */
  public getBankAccountById({
    bankAccountId,
  }: InvestorBrokerageGetBankAccountByIdRequestDto) {
    const encodedBankAccountId = encodeURIComponent(bankAccountId);
    return this.axios.get<InvestorBrokerageBankAccForPartyItem>(
      `${this.apiPath}/bank-accounts/${encodedBankAccountId}`
    );
  }

  /**
   * Create a direct debit mandate for a party.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_CreateDirectDebitMandateForParty}
   */
  public async createDirectDebitMandateForParty(
    args: InvestorBrokerageCreateDirectDebitMandateRequestDto
  ) {
    return this.axios.post<InvestorBrokerageCreateDirectDebitMandateResponseDto>(
      this.apiPath + '/direct-debits/mandates',
      args
    );
  }

  /**
   * Get direct debit mandates for a party.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetDirectDebitMandatesByParty}
   */
  public async getDirectDebitMandatesByParty() {
    return this.axios.get<InvestorBrokerageGetDirectDebitMandatesResponseDto>(
      this.apiPath + '/direct-debits/mandates'
    );
  }

  /**
   * Delete a direct debit mandate for a party.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_CancelDirectDibetMandate}
   */
  public async cancelDirectDebitMandate({
    mandateId,
  }: InvestorBrokerageDirectDebitMandateCancelRequestDto) {
    const encodedMandateId = encodeURIComponent(mandateId);
    return this.axios.post(
      `${this.apiPath}/direct-debits/mandates/${encodedMandateId}/actions/cancel`
    );
  }

  /**
   * Get direct debit mandate pdf.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetDirectDebitMandatePdf}
   */
  public async getDirectDebitMandatePdf({
    mandateId,
  }: InvestorBrokerageDirectDebitMandateGetPdfRequestDto) {
    const encodedMandateId = encodeURIComponent(mandateId);
    return this.axios.get(
      `${this.apiPath}/direct-debits/mandates/${encodedMandateId}/pdf`,
      {
        responseType: 'blob',
      }
    );
  }

  /**
   *
   * Get direct debit mandate pdf preview.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetDirectDebitMandatePdfPreview}
   */
  public async getDirectDebitMandatePdfPreview({
    bankAccountId,
  }: InvestorBrokerageDirectDebitMandateGetPdfPreviewRequestDto) {
    const encodedBankAccountId = encodeURIComponent(bankAccountId);
    return this.axios.get(
      `${this.apiPath}/direct-debits/mandates/preview-mandate-pdf/?bankAccountId=${encodedBankAccountId}`
    );
  }

  /**
   * Create a direct debit payment.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_CreateDirectDebitPayment}
   */
  public async createDirectDebitPayment(
    args: InvestorBrokerageUkDirectDebitCreatePaymentReqDto
  ) {
    return this.axios.post<InvestorBrokerageUkDirectDebitCreatePaymentResDto>(
      this.apiPath + '/direct-debits/payments',
      args
    );
  }

  /**
   * Get the list of direct debits payments for the investor
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetDirectDebitPayment}
   */
  public async getDirectDebitPayments() {
    return this.axios.get<InvestorBrokerageUkDirectDebitPaymentListAllResponseDto>(
      this.apiPath + '/direct-debits/payments'
    );
  }

  /**
   * Get next possible payment date.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetNextPossiblePaymentDate}
   */
  public async getNextPossiblePaymentDate({
    mandateId,
  }: InvestorBrokerageGetNextPossiblePaymentRequestDto) {
    const encodedMandateId = encodeURIComponent(mandateId);
    return this.axios.get<InvestorBrokerageGetNextPossiblePaymentResponseDto>(
      `${this.apiPath}/direct-debits/mandates/${encodedMandateId}/next-possible-payment`
    );
  }

  /**
   * Get next possible payment date.
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_CreateDirectDebitSubscription}
   */
  public async createDirectDebitSubscription(
    args: InvestorBrokerageUkDirectDebitCreateSubscriptionReqDto
  ) {
    return this.axios.post<InvestorBrokerageUkDirectDebitCreateSubscriptionResDto>(
      `${this.apiPath}/direct-debits/subscriptions`,
      args
    );
  }

  /**
   * Get list of direct debit subscriptions
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_GetDirectDebitSubscriptions}
   */
  public async getDirectDebitSubscriptions(
    args: InvestorBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ) {
    return this.axios.get<InvestorBrokerageUkDirectDebitSubscriptionListAllResponseDto>(
      `${this.apiPath}/direct-debits/subscriptions`,
      {
        params: args,
      }
    );
  }

  /**
   * Cancel direct debit subscription
   * @link {http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_CancelDirectDebitSubscription}
   */
  public async cancelDirectDebitSubscription(
    args: InvestorBrokerageCancelDirectDebitSubscriptionRequestDto
  ) {
    return this.axios.post(
      `${this.apiPath}/direct-debits/subscriptions/${args.subscriptionId}/actions/cancel`
    );
  }

  /**
   * create withdrawal request
   * {@link http://localhost:9000/openapi#/Transact%20Investor/TransactInvestorController_CreateWithdrawalRequest}
   */
  public async createWithdrawalRequest(
    args: InvestorBrokerageWithdrawalRequestDto
  ) {
    return this.axios.post<InvestorBrokerageWithdrawalResponseDto>(
      `${this.apiPath}/withdrawals`,
      args
    );
  }
}
