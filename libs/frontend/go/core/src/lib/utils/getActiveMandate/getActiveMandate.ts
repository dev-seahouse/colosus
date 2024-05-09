import type { InvestorBrokerageGetDirectDebitMandatesResponseDto } from '@bambu/api-client';
import {
  InvestorBrokerageDirectDebitMandateItem,
  InvestorBrokerUkDirectDebitMandateStatusEnum,
} from '@bambu/api-client';
import hasActiveDirectDebitMandates from '../mandateStatusUtils/hasActiveDirectDebitMandates';

export function getActiveMandate(
  mandates: InvestorBrokerageGetDirectDebitMandatesResponseDto | undefined
) {
  if (!hasActiveDirectDebitMandates(mandates)) return undefined;
  return mandates?.find((mandate) => byActiveMandate(mandate));
}

export function byActiveMandate(
  mandate: InvestorBrokerageDirectDebitMandateItem
) {
  return mandate.status === InvestorBrokerUkDirectDebitMandateStatusEnum.ACTIVE;
}
