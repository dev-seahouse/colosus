import type { InvestorBrokerageGetBankAccountsForPartyResponseDto } from '../Brokerage.types';

export const getBankAccountsMockRes = [
  {
    accountNumber: '55779911',
    countryCode: 'GB',
    currency: 'GBP',
    name: 'C Kent & L Lane',
    sortCode: '20-00-00',
    addedAt: '2021-01-01T00:00:00.000Z',
    clientReference: '1944a59713',
    deactivatedAt: '2021-01-01T00:00:00.000Z',
    id: 'bnk-33wdqmffe22aq6',
    partyId: 'pty-33wds6i4i242wc',
  },
] satisfies InvestorBrokerageGetBankAccountsForPartyResponseDto;
