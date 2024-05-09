import {
  BrokerageIntegrationServerDto,
  IColossusTrackingDto,
  InvestorKycDto,
} from '@bambu/server-core/dto';
import {
  AuthenticationDto,
  IBrokerageIntegrationListAllWithdrawalsQueryResponseDto,
  IBrokerageIntegrationWithdrawalDto,
  IColossusListAllWithdrawalsQueryParamsDto,
  IColossusUserOtpRequestDto,
  IColossusWithdrawalMutableDto,
  IGetModelPortfolioByIdResponseDto,
  IInstrumentAssetClassDto,
  IInstrumentsSearchResponseDto,
  IInvestorPlatformProfileDto,
  IInvestorPlatformProfileGoalDto,
  ITransactPortfolioHoldingsDto,
} from '@bambu/shared';

export interface IConvertLeadToPlatformUserByOriginAndEmailParams {
  tracking: IColossusTrackingDto;
  email: string;
  password: string;
  origin: string;
}

export interface IResendVerificationOtpParamsDto {
  tracking: IColossusTrackingDto;
  email: string;
  origin: string;
}

export interface ILoginParams {
  tracking: IColossusTrackingDto;
  username: string;
  password: string;
  origin: string;
}

export abstract class TransactInvestorServiceBase {
  /**
   * The user provides a password, upon which they transition to a
   * platform user.
   */
  abstract ConvertLeadToPlatformUserByOriginAndEmail(
    params: IConvertLeadToPlatformUserByOriginAndEmailParams
  ): Promise<void>;

  abstract Login(
    params: ILoginParams
  ): Promise<AuthenticationDto.IAuthenticationLoginResponseDto>;

  public abstract ResendVerificationOtp(
    params: IResendVerificationOtpParamsDto
  ): Promise<void>;

  public abstract VerifyInvestorPlatformUserVerificationOtp(
    requestId: string,
    origin: string,
    payload: IColossusUserOtpRequestDto
  ): Promise<boolean>;

  public abstract GetInvestorPlatformUserProfile(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<IInvestorPlatformProfileDto>;

  public abstract SubmitKycToBrokerage(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: InvestorKycDto.IColossusKycRequestPayloadDto
  ): Promise<InvestorKycDto.IColossusKycResponsePayloadDto>;

  public abstract GetBrokerageProfileForInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<InvestorKycDto.IColossusKycResponsePayloadDto>;

  public abstract GetPartyForInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyDto>;

  public abstract GetAddressesForInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageIntegrationPartyAddressDto[]
  >;

  public abstract GetAccountsForInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationAccountDto[]>;

  public abstract GetInstrumentAssetClasses(
    tracking: IColossusTrackingDto
  ): Promise<IInstrumentAssetClassDto[]>;

  public abstract GetInstruments(
    tracking: IColossusTrackingDto,
    pageIndex: number,
    pageSize: number,
    searchString: string
  ): Promise<IInstrumentsSearchResponseDto>;

  public abstract GetBankAccountsForParty(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto[]
  >;

  public abstract CreateBankAccountForParty(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: Omit<
      BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountMutableDto,
      'partyId' | 'clientReference'
    >
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>;

  public abstract GetDirectDebitMandatesByParty(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto[]>;

  public abstract CreateDirectDebitMandateForParty(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>;

  public abstract GetTransactModelPortfolioById(
    requestId: string,
    origin: string,
    id: string
  ): Promise<IGetModelPortfolioByIdResponseDto>;

  public abstract GetDirectDebitMandatePdf(
    tracking: IColossusTrackingDto,
    tenantId: string,
    mandateId: string,
    origin: string
  ): Promise<[ArrayBuffer, string]>;

  public abstract CancelDirectDebitMandate(
    tracking: IColossusTrackingDto,
    tenantId: string,
    mandateId: string,
    origin: string
  ): Promise<void>;

  public abstract GetMandatePdfPreview(
    tracking: IColossusTrackingDto,
    tenantId: string,
    bankAccountId: string,
    origin: string
  ): Promise<[ArrayBuffer, string]>;

  public abstract GetNextPossiblePaymentDate(
    tracking: IColossusTrackingDto,
    tenantId: string,
    mandateId: string,
    origin: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto>;

  public abstract GetDirectDebitPayments(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto & {
      mandateId?: string;
      goalId?: string;
    }
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto>;

  public abstract CreateDirectDebitPayment(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string,
    payload: Omit<
      BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentMutableDto,
      'portfolioId'
    >
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto>;

  public abstract CancelDirectDebitPayment(
    tracking: IColossusTrackingDto,
    tenantId: string,
    paymentId: string,
    origin: string
  ): Promise<void>;

  public abstract GetGoalDetails(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string,
    augmentWithBrokerageData: boolean
  ): Promise<IInvestorPlatformProfileGoalDto>;

  public abstract GetTransactionsForGoal(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string,
    params: BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationTransactionsListAllResponseDto>;

  public abstract GetBankAccountsForPartyPaged(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    input: BrokerageIntegrationServerDto.IBrokerageIntegrationListAllQueryParamsBaseDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationPartyBankAccountListAllResponseDto>;

  public abstract GetBankAccountForPartyByBankAccountId(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    bankAccountId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageIntegrationBankAccountDto>;

  public abstract GetGoalsForTenantInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    pageIndex: number,
    pageSize: number
  ): Promise<IInvestorPlatformProfileGoalDto[]>;

  public abstract GetCountOfGoalsForTenantInvestor(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string
  ): Promise<number>;

  public abstract CreateDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    goalId: string,
    payload: Omit<
      BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto,
      'portfolioId'
    >
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionResDto>;

  public abstract GetDirectDebitSubscriptions(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto>;

  public abstract UpdateDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
  ): Promise<void>;

  public abstract ListUpcomingDirectDebitSubscriptions(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
  >;

  public abstract PauseDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract CancelDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract ResumeDirectDebitSubscription(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract GetHoldingsForGoal(
    tracking: IColossusTrackingDto,
    input: {
      tenantId: string;
      origin: string;
      goalId: string;
    }
  ): Promise<ITransactPortfolioHoldingsDto[]>;

  public abstract ListWithdrawalsForGoal(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: IColossusListAllWithdrawalsQueryParamsDto
  ): Promise<IBrokerageIntegrationListAllWithdrawalsQueryResponseDto>;

  public abstract CreateWithdrawalRequest(
    tracking: IColossusTrackingDto,
    tenantId: string,
    origin: string,
    payload: IColossusWithdrawalMutableDto
  ): Promise<IBrokerageIntegrationWithdrawalDto>;
}
