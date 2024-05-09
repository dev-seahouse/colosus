import { InvestorBrokerageGetDirectDebitMandatesResponseDto } from '@bambu/api-client';

export function hasDirectDebitMandates(
  mandates: unknown
): mandates is InvestorBrokerageGetDirectDebitMandatesResponseDto {
  return (
    Array.isArray(mandates) && mandates.length > 0 && 'partyId' in mandates[0]
  );
}

export default hasDirectDebitMandates;
