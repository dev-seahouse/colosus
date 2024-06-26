import {
  GoalRecurringSavingsPlanFrequencyEnum,
  GoalRecurringSavingsPlanStatusEnum,
  GoalStatusEnum,
  InvestorTypeEnum,
  SharedEnums,
} from '@bambu/shared';
import type { InvestorGetInvestorPlatformUserProfileResponseDto } from '../Profile';

export const getInvestorPlatformUserProfileMockResponse = {
  id: 'e25a987f-25b8-4af1-b7e5-bd9547a721b8',
  name: 'kenan',
  email: 'kenan+go@bambu.co',
  phoneNumber: '12345678',
  zipCode: '111111',
  age: 44,
  incomePerAnnum: 80000,
  currentSavings: 0,
  monthlySavings: 2000,
  isRetired: false,
  isEmployed: true,
  type: InvestorTypeEnum.PLATFORM_USER,
  leadReviewStatus: 'NEW',
  data: null,
  tenantId: '0bc1e3e3-63fb-4495-beb8-411054baecda',
  createdBy: 'COLOSSUS',
  createdAt: new Date('2023-10-21T18:59:39.107Z'),
  updatedBy: 'COLOSSUS',
  updatedAt: new Date('2023-10-21T18:59:39.437Z'),
  Goals: [
    {
      ConnectPortfolioSummary: {
        id: '05ed5255-4e1f-4324-bee3-cea1a7797d6e',
        tenantId: 'c1f400b5-6aeb-48fa-a38e-c1f30cf716de',
        key: 'AGGRESSIVE',
        name: 'Aggressive Portfolio',
        description:
          'This portfolio is suitable for investors seeking high returns and who are willing to take on high risk. It has a long-term investment time horizon.',
        sortKey: 50,
        expectedReturnPercent: '8',
        expectedVolatilityPercent: '18',
        showSummaryStatistics: true,
        reviewed: false,
        assetClassAllocation: [
          {
            included: true,
            assetClass: 'Equity',
            percentOfPortfolio: '100',
          },
          {
            included: true,
            assetClass: 'Money Market',
            percentOfPortfolio: '0',
          },
          {
            included: true,
            assetClass: 'Bonds',
            percentOfPortfolio: '0',
          },
          {
            included: true,
            assetClass: 'Other',
            percentOfPortfolio: '0',
          },
        ],
        // createdBy: 'COLOSSUS',
        // createdAt: '2023-07-18T14:15:34.554Z',
        // updatedBy: 'COLOSSUS',
        // updatedAt: '2023-07-18T14:15:34.554Z',
        risk_profile_id: 'd30d1d4b-97aa-4028-9e56-c651004a106c',
        RiskProfile: {
          id: 'd30d1d4b-97aa-4028-9e56-c651004a106c',
          lowerLimit: '5',
          upperLimit: '5',
          riskProfileName: 'Aggressive',
          riskProfileDescription:
            'You are OK with high volatility in your portfolio.<br/>You understand that the value of your portfolio may go down sharply in the future but you know that you will reap big benefits if you are patient enough.<br/>You expect high returns in the long term.',
          tenantId: 'c1f400b5-6aeb-48fa-a38e-c1f30cf716de',
          createdBy: 'COLOSSUS MIGRATION SCRIPT',
          createdAt: '2023-09-06T07:40:23.134Z',
          updatedBy: 'COLOSSUS MIGRATION SCRIPT',
          updatedAt: '2023-10-10T03:13:10.748Z',
        },
        TransactModelPortfolios: [
          {
            id: '05ed5255-4e1f-4324-bee3-cea1a7797d6e',
            name: 'string',
            description: 'string',
            expectedAnnualReturn: null,
            expectedAnnualVolatility: null,
            rebalancingThreshold: null,
            factSheetUrl: 'string',
            partnerModelId: 'mdl-36h4zk4q6242wa',
            connectPortfolioSummaryId: '05ed5255-4e1f-4324-bee3-cea1a7797d6e',
            createdBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
            createdAt: '2023-10-24T16:11:16.475Z',
            updatedBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
            updatedAt: '2023-10-26T02:20:24.688Z',
            TransactModelPortfolioInstruments: [
              {
                id: 'bb4ee6a2-29ab-4545-86a2-df60eda60597',
                weightage: 0.28,
                instrumentId: '149696a7a208d8f3074ee563f7a42d5b',
                transactModelPortfolioId:
                  '05ed5255-4e1f-4324-bee3-cea1a7797d6e',
                createdBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
                createdAt: '2023-10-24T17:56:57.192Z',
                updatedBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
                updatedAt: '2023-10-24T17:56:57.192Z',
                Instrument: {
                  id: '149696a7a208d8f3074ee563f7a42d5b',
                  bloombergTicker: 'ISF',
                  ricSymbol: null,
                  isin: 'IE0005042456',
                  cusip: null,
                  name: 'iShares Core FTSE 100 UCITS ETF GBP Dist',
                  instrumentAssetClassId:
                    '63af8e9c-c378-4068-b96e-0e63ca9d629e',
                  instrumentExchangeId: '9743a4b3-fcbc-4bcd-9200-d64b184d7619',
                  instrumentCurrencyId: 'c6e977a6-5208-4726-bdf5-e905ee11a7ff',
                  createdBy: 'QUARK',
                  createdAt: '2023-10-19T14:04:33.119Z',
                  updatedBy: 'QUARK',
                  updatedAt: '2023-10-26T02:02:27.737Z',
                  InstrumentCurrency: {
                    id: 'c6e977a6-5208-4726-bdf5-e905ee11a7ff',
                    iso4217Code: 'GBP',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:44:15.035Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:44:15.035Z',
                  },
                  InstrumentExchange: {
                    id: '9743a4b3-fcbc-4bcd-9200-d64b184d7619',
                    bambuExchangeCode: 'XLON',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:48:04.826Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:48:04.826Z',
                  },
                  InstrumentFactSheets: [
                    {
                      id: 'b538789e-58ee-4dbc-a623-131882fdc582',
                      url: 'https://www.ishares.com/uk/individual/en/products/251795/',
                      instrumentId: '149696a7a208d8f3074ee563f7a42d5b',
                      createdBy: 'QUARK',
                      createdAt: '2023-10-19T14:04:33.122Z',
                      updatedBy: 'QUARK',
                      updatedAt: '2023-10-19T14:04:33.122Z',
                    },
                  ],
                  InstrumentAssetClass: {
                    id: '63af8e9c-c378-4068-b96e-0e63ca9d629e',
                    name: 'Equities',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:51:04.343Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:51:04.343Z',
                  },
                },
              },
              {
                id: '967eebfe-bd8f-49ce-9277-9245f3cd1cd3',
                weightage: 0.5,
                instrumentId: '597bb65ddccc3503df81d2283b95d1d9',
                transactModelPortfolioId:
                  '05ed5255-4e1f-4324-bee3-cea1a7797d6e',
                createdBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
                createdAt: '2023-10-24T17:56:57.191Z',
                updatedBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
                updatedAt: '2023-10-24T17:56:57.191Z',
                Instrument: {
                  id: '597bb65ddccc3503df81d2283b95d1d9',
                  bloombergTicker: 'IWDA',
                  ricSymbol: null,
                  isin: 'IE00B4L5Y983',
                  cusip: null,
                  name: 'iShares Core MSCI World UCITS ETF USD (Acc)',
                  instrumentAssetClassId:
                    '63af8e9c-c378-4068-b96e-0e63ca9d629e',
                  instrumentExchangeId: '9743a4b3-fcbc-4bcd-9200-d64b184d7619',
                  instrumentCurrencyId: 'e5b5eab9-3e9c-443d-88b5-db3292176802',
                  createdBy: 'QUARK',
                  createdAt: '2023-10-19T14:04:33.049Z',
                  updatedBy: 'QUARK',
                  updatedAt: '2023-10-26T02:02:27.696Z',
                  InstrumentCurrency: {
                    id: 'e5b5eab9-3e9c-443d-88b5-db3292176802',
                    iso4217Code: 'USD',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:44:15.035Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:44:15.035Z',
                  },
                  InstrumentExchange: {
                    id: '9743a4b3-fcbc-4bcd-9200-d64b184d7619',
                    bambuExchangeCode: 'XLON',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:48:04.826Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:48:04.826Z',
                  },
                  InstrumentFactSheets: [
                    {
                      id: '4e24ac77-952d-4bcd-8ba4-2baa85e230a8',
                      url: 'https://www.ishares.com/uk/individual/en/products/251882/ishares-msci-world-ucits-etf-acc-fund',
                      instrumentId: '597bb65ddccc3503df81d2283b95d1d9',
                      createdBy: 'QUARK',
                      createdAt: '2023-10-19T14:04:33.059Z',
                      updatedBy: 'QUARK',
                      updatedAt: '2023-10-19T14:04:33.059Z',
                    },
                  ],
                  InstrumentAssetClass: {
                    id: '63af8e9c-c378-4068-b96e-0e63ca9d629e',
                    name: 'Equities',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:51:04.343Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:51:04.343Z',
                  },
                },
              },
              {
                id: '79d6dad0-735a-11ee-b962-0242ac120002',
                weightage: 0.2,
                instrumentId: '912e7f76cfb94307876bcfc3d2bdcf28',
                transactModelPortfolioId:
                  '05ed5255-4e1f-4324-bee3-cea1a7797d6e',
                createdBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
                createdAt: '2023-10-26T01:17:25.000Z',
                updatedBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
                updatedAt: '2023-10-26T01:17:26.000Z',
                Instrument: {
                  id: '912e7f76cfb94307876bcfc3d2bdcf28',
                  bloombergTicker: 'WSML',
                  ricSymbol: null,
                  isin: 'IE00BF4RFH31',
                  cusip: null,
                  name: 'iShares MSCI World Small Cap UCITS ETF USD (Acc)',
                  instrumentAssetClassId:
                    '63af8e9c-c378-4068-b96e-0e63ca9d629e',
                  instrumentExchangeId: '9743a4b3-fcbc-4bcd-9200-d64b184d7619',
                  instrumentCurrencyId: 'e5b5eab9-3e9c-443d-88b5-db3292176802',
                  createdBy: 'QUARK',
                  createdAt: '2023-10-19T14:04:33.305Z',
                  updatedBy: 'QUARK',
                  updatedAt: '2023-10-26T02:02:27.848Z',
                  InstrumentCurrency: {
                    id: 'e5b5eab9-3e9c-443d-88b5-db3292176802',
                    iso4217Code: 'USD',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:44:15.035Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:44:15.035Z',
                  },
                  InstrumentExchange: {
                    id: '9743a4b3-fcbc-4bcd-9200-d64b184d7619',
                    bambuExchangeCode: 'XLON',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:48:04.826Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:48:04.826Z',
                  },
                  InstrumentFactSheets: [
                    {
                      id: '8d2fb9dc-9d5f-4724-a28c-54ae6766e48d',
                      url: 'https://www.ishares.com/uk/individual/en/products/296576/?referrer=tickerSearch',
                      instrumentId: '912e7f76cfb94307876bcfc3d2bdcf28',
                      createdBy: 'QUARK',
                      createdAt: '2023-10-19T14:04:33.306Z',
                      updatedBy: 'QUARK',
                      updatedAt: '2023-10-19T14:04:33.306Z',
                    },
                  ],
                  InstrumentAssetClass: {
                    id: '63af8e9c-c378-4068-b96e-0e63ca9d629e',
                    name: 'Equities',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:51:04.343Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:51:04.343Z',
                  },
                },
              },
              {
                id: '79d6dd64-735a-11ee-b962-0242ac120002',
                weightage: 0.02,
                instrumentId: 'c17f9b17d0d8177afae3453429e221aa',
                transactModelPortfolioId:
                  '05ed5255-4e1f-4324-bee3-cea1a7797d6e',
                createdBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
                createdAt: '2023-10-26T01:17:25.000Z',
                updatedBy: 'c1631f0f-50b0-437c-b728-1fb9f29b74b6',
                updatedAt: '2023-10-26T01:17:28.000Z',
                Instrument: {
                  id: 'c17f9b17d0d8177afae3453429e221aa',
                  bloombergTicker: 'CASH_GBP',
                  ricSymbol: null,
                  isin: 'CASH_GBP',
                  cusip: null,
                  name: 'Cash - Pound Sterling',
                  instrumentAssetClassId:
                    'ae5c977d-bd68-4d8a-82b0-3e778bbb5a4c',
                  instrumentExchangeId: 'b3470107-8033-46f0-bf3a-66fa81897855',
                  instrumentCurrencyId: 'c6e977a6-5208-4726-bdf5-e905ee11a7ff',
                  createdBy: 'QUARK',
                  createdAt: '2023-10-26T02:02:27.873Z',
                  updatedBy: 'QUARK',
                  updatedAt: '2023-10-26T02:02:27.873Z',
                  InstrumentCurrency: {
                    id: 'c6e977a6-5208-4726-bdf5-e905ee11a7ff',
                    iso4217Code: 'GBP',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-19T13:44:15.035Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-19T13:44:15.035Z',
                  },
                  InstrumentExchange: {
                    id: 'b3470107-8033-46f0-bf3a-66fa81897855',
                    bambuExchangeCode: 'CASH',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-26T02:02:27.665Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-26T02:02:27.665Z',
                  },
                  InstrumentFactSheets: [],
                  InstrumentAssetClass: {
                    id: 'ae5c977d-bd68-4d8a-82b0-3e778bbb5a4c',
                    name: 'Cash',
                    createdBy: 'QUARK',
                    createdAt: '2023-10-25T17:13:00.790Z',
                    updatedBy: 'QUARK',
                    updatedAt: '2023-10-25T17:13:00.790Z',
                  },
                },
              },
            ],
          },
        ],
      },
      portfolioValue: 0,
      portfolioValueCurrency: 'GBP',
      portfolioValueDate: '2023-10-26',
      id: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f',
      goalName: 'House',
      goalDescription: 'Buy a house',
      goalValue: 60000,
      goalTimeframe: 4,
      initialInvestment: 20000,
      goalStartDate: null,
      goalEndDate: null,
      status: GoalStatusEnum.PENDING,
      computedRiskProfile: {
        riskAppetite: 'bca96485-8dc2-41fc-aabf-2a3f4745aab8',
        riskProfileId: '4bf6874c-e5ea-4f66-b2f9-e1212b823422',
      },
      sendLeadAppointmentEmail: false,
      sendLeadGoalProjectionEmail: false,
      investorId: 'e25a987f-25b8-4af1-b7e5-bd9547a721b8',
      connectPortfolioSummaryId: 'bca96485-8dc2-41fc-aabf-2a3f4745aab8',
      data: {
        projectedReturns: {
          low: 0,
          high: 0,
          target: 0,
        },
      },
      createdBy: 'COLOSSUS',
      createdAt: new Date('2023-10-21T18:59:39.122Z'),
      updatedBy: 'COLOSSUS',
      updatedAt: new Date('2023-10-21T18:59:39.122Z'),
      GoalRecurringSavingsPlans: [
        {
          id: '43cfbf67-fd96-4097-b4ba-013086e6cd74',
          amount: 1000,
          currency: 'GBP',
          frequency: GoalRecurringSavingsPlanFrequencyEnum.MONTHLY,
          status: GoalRecurringSavingsPlanStatusEnum.PENDING,
          data: {
            projectedReturns: {
              low: 0,
              high: 0,
              target: 0,
            },
          },
          goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f',
          createdBy: 'COLOSSUS',
          createdAt: new Date('2023-10-21T18:59:39.122Z'),
          updatedBy: 'COLOSSUS',
          updatedAt: new Date('2023-10-21T18:59:39.122Z'),
        },
      ],
    },
  ],
  InvestorPlatformUsers: [
    {
      id: 'e25a987f-25b8-4af1-b7e5-bd9547a721b8',
      applicationId: '80f30528-9590-4ea2-aebd-d0641a24933c',
      data: null,
      createdBy: 'COLOSSUS',
      createdAt: new Date('2023-10-21T18:59:39.439Z'),
      updatedBy: 'COLOSSUS',
      updatedAt: new Date('2023-10-21T18:59:39.439Z'),
      investorId: 'e25a987f-25b8-4af1-b7e5-bd9547a721b8',
      InvestorPlatformUserAccounts: [
        {
          id: 'a602bbbb-dbe3-44da-9b59-7f7c2de1d7d8',
          brokerage:
            SharedEnums.SupportedBrokerageIntegrationEnum.WEALTH_KERNEL,
          partnerAccountId: 'pty-36he5eiiq242go',
          partnerAccountNumber: 'acc-36he5enl6242pq',
          partnerAccountType: 'GIA',
          data: null,
          investorPlatformUserId: 'e25a987f-25b8-4af1-b7e5-bd9547a721b8',
          createdBy: 'e25a987f-25b8-4af1-b7e5-bd9547a721b8',
          createdAt: new Date('2023-10-23T05:04:44.146Z'),
          updatedBy: 'e25a987f-25b8-4af1-b7e5-bd9547a721b8',
          updatedAt: new Date('2023-10-23T05:04:44.146Z'),
        },
      ],
    },
  ],
} satisfies InvestorGetInvestorPlatformUserProfileResponseDto;

export default getInvestorPlatformUserProfileMockResponse;
