import type { InvestorBrokerageIntegrationPartyBankAccountListAllResponseDto } from '../../Brokerage.types';

export const getBankAccountsPagedMockRes = {
  paginationToken: 'string',
  results: [
    {
      partyId: 'pty-33wds6i4i242wc',
      clientReference: '1944a59713',
      name: 'C Kent & L Lane',
      accountNumber: '55779911',
      sortCode: '20-00-00',
      currency: 'GBP',
      countryCode: 'GB',
      id: 'bnk-33wdqmffe22aq6',
      addedAt: '2021-01-01T00:00:00.000Z',
      deactivatedAt: '2021-01-01T00:00:00.000Z',
    },
  ],
} satisfies InvestorBrokerageIntegrationPartyBankAccountListAllResponseDto;

export default getBankAccountsPagedMockRes;
