import hasDirectDebitMandates from './hasDirectDebitMandates';
import type { InvestorBrokerageGetDirectDebitMandatesResponseDto } from '@bambu/api-client';
import { InvestorBrokerUkDirectDebitMandateStatusEnum } from '@bambu/api-client';

export function hasActiveDirectDebitMandates(
  mandates: unknown
): mandates is InvestorBrokerageGetDirectDebitMandatesResponseDto {
  if (!Array.isArray(mandates)) return false;
  return (
    hasDirectDebitMandates(mandates) &&
    mandates.some(
      (mandate) =>
        mandate.status === InvestorBrokerUkDirectDebitMandateStatusEnum.ACTIVE
    )
  );
}

export default hasActiveDirectDebitMandates;
