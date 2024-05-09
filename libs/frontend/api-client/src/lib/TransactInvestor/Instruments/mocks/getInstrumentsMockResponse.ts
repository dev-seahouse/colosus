import type { InvestorGetInstrumentsResponseDto } from '../Instruments';

export const getInstrumentsMockResponse = {
  data: [
    {
      InstrumentAssetClass: {
        createdAt: new Date('2023-10-21T10:37:51.512Z'),
        createdBy: 'string',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        name: 'string',
        updatedAt: new Date('2023-10-21T10:37:51.512Z'),
        updatedBy: 'string',
      },
      InstrumentCurrency: {
        createdAt: new Date('2023-10-21T10:37:51.512Z'),
        createdBy: 'string',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        iso4217Code: 'string',
        updatedAt: new Date('2023-10-21T10:37:51.512Z'),
        updatedBy: 'string',
      },
      InstrumentExchange: {
        bambuExchangeCode: 'string',
        createdAt: new Date('2023-10-21T10:37:51.512Z'),
        createdBy: 'string',
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        updatedAt: new Date('2023-10-21T10:37:51.512Z'),
        updatedBy: 'string',
      },
      InstrumentFactSheet: [
        {
          createdAt: new Date('2023-10-21T10:37:51.512Z'),
          createdBy: 'string',
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          instrumentId: 'string',
          updatedAt: new Date('2023-10-21T10:37:51.512Z'),
          updatedBy: 'string',
          url: 'string',
        },
      ],
      bloombergTicker: null,
      createdAt: new Date('2023-10-21T10:37:51.512Z'),
      createdBy: 'string',
      cusip: null,
      id: 'string',
      instrumentAssetClassId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      instrumentCurrencyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      instrumentExchangeId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      isin: null,
      name: 'string',
      ricSymbol: null,
      updatedAt: new Date('2023-10-21T10:37:51.512Z'),
      updatedBy: 'string',
    },
  ],
  filteredCount: 0,
  allTotalCount: 0,
  pageCount: 0,
} satisfies InvestorGetInstrumentsResponseDto;

export default getInstrumentsMockResponse;
