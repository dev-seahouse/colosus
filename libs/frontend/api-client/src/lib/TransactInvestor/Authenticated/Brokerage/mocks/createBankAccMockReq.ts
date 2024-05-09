import type { InvestorBrokerageCreateBankAccountForPartyRequestDto } from '../Brokerage.types';

export const createBankAccMockReq = {
  accountNumber: '55779911',
  countryCode: 'GB',
  currency: 'GBP',
  name: 'C Kent & L Lane',
  sortCode: '20-00-00',
} satisfies InvestorBrokerageCreateBankAccountForPartyRequestDto;
