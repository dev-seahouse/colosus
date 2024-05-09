import type { InvestorBrokerageGetBankAccountsForPartyResponseDto } from '@bambu/api-client';

export function hasBankAccounts(
  bankAccounts: unknown
): bankAccounts is InvestorBrokerageGetBankAccountsForPartyResponseDto {
  return (
    Array.isArray(bankAccounts) &&
    bankAccounts.length > 0 &&
    'accountNumber' in bankAccounts[0]
  );
}

export default hasBankAccounts;
