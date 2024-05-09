import { BrokerageIntegrationServerDto } from '@bambu/server-core/dto';

export abstract class BrokerageIntegrationDirectDebitDomainBaseService {
  public abstract List(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateListAllResponseDto>;
  public abstract GetMandatePdfPreview(
    requestId: string,
    tenantId: string,
    bankAccountId: string
  ): Promise<[ArrayBuffer, string]>;
  public abstract Create(
    requestId: string,
    tenantId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateMutableDto,
    idempotencyKey?: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>;
  public abstract Get(
    requestId: string,
    tenantId: string,
    brokerageUkDirectDebitMandateId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateDto>;

  public abstract Cancel(
    requestId: string,
    tenantId: string,
    brokerageUkDirectDebitMandateId: string
  ): Promise<void>;

  public abstract RetrieveMandatePdf(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<[ArrayBuffer, string]>;

  public abstract GetNextPossiblePaymentCollectionDate(
    requestId: string,
    tenantId: string,
    mandateId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitMandateNextPossibleConnectionDateDto>;

  // Direct Debit Payments Methods

  public abstract CreatePayment(
    requestId: string,
    tenantId: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreatePaymentResDto>;

  public abstract GetPayment(
    requestId: string,
    token: string,
    paymentId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentDto>;

  public abstract ListPayments(
    requestId: string,
    tenantId: string,
    input: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitPaymentListAllResponseDto>;

  public abstract CancelPayment(
    requestId: string,
    tenantId: string,
    paymentId: string
  ): Promise<void>;

  // Direct Debit Subscriptions Methods

  public abstract GetSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>;

  public abstract UpdateSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpdateSubscriptionDto
  ): Promise<void>;

  public abstract ListAllSubscriptions(
    requestId: string,
    tenantId: string,
    queryParams: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllQueryParamsDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitSubscriptionListAllResponseDto>;

  public abstract CreateSubscription(
    requestId: string,
    tenantId: string,
    idempotencyKey: string,
    payload: BrokerageIntegrationServerDto.IBrokerageUkDirectDebitCreateSubscriptionReqDto
  ): Promise<BrokerageIntegrationServerDto.IBrokerageUkDirectDebitGetSubscriptionDto>;

  public abstract ListUpcomingSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<
    BrokerageIntegrationServerDto.IBrokerageUkDirectDebitUpcomingSubscriptionDto[]
  >;

  public abstract PauseSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract ResumeSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void>;

  public abstract CancelSubscription(
    requestId: string,
    tenantId: string,
    subscriptionId: string
  ): Promise<void>;
}
