import hasDirectDebitMandates from './hasDirectDebitMandates';
import {
  InvestorBrokerageGetDirectDebitMandatesResponseDto,
  InvestorBrokerUkDirectDebitMandateStatusEnum,
} from '@bambu/api-client';

export function hasPendingMandates(
  mandates: unknown
): mandates is InvestorBrokerageGetDirectDebitMandatesResponseDto {
  return (
    hasDirectDebitMandates(mandates) &&
    mandates.some(
      (mandate) =>
        mandate.status === InvestorBrokerUkDirectDebitMandateStatusEnum.PENDING
    )
  );
}

export default hasDirectDebitMandates;
