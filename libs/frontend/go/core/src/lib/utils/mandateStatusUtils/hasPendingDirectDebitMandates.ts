import type { InvestorBrokerageGetDirectDebitMandatesResponseDto } from '@bambu/api-client';
import { InvestorBrokerUkDirectDebitMandateStatusEnum } from '@bambu/api-client';
import hasDirectDebitMandates from './hasDirectDebitMandates';

export function hasPendingDirectDebitMandates(
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

export default hasPendingDirectDebitMandates;
