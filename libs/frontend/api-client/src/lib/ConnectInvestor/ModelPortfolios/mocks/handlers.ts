import { rest } from 'msw';
import type { ConnectInvestorGetModelPortfoliosSummaryResponseDto } from '../ModelPortfolios';

const mockGetModelPortfoliosSummaryResponse: ConnectInvestorGetModelPortfoliosSummaryResponseDto =
  [
    {
      id: 'f10502f5-6f15-4eb1-9524-dc09bafceec7',
      key: 'CONSERVATIVE',
      name: 'Conservative Portfolio',
      description:
        'This portfolio is suitable for investors who want to preserve their capital, who are OK with low returns and/or who are investing with a short term time horizon.',
      expectedReturnPercent: '3',
      expectedVolatilityPercent: '4',
      reviewed: true,
      showSummaryStatistics: true,
      assetClassAllocation: [
        {
          included: true,
          assetClass: 'Equity',
          percentOfPortfolio: '0',
        },
        {
          included: true,
          assetClass: 'Money Market',
          percentOfPortfolio: '30',
        },
        {
          included: true,
          assetClass: 'Bonds',
          percentOfPortfolio: '70',
        },
        {
          included: true,
          assetClass: 'Other',
          percentOfPortfolio: '0',
        },
      ],
      riskProfileId: '8e6fb5fd-e8b4-4019-9d2c-6fd1ff8f6e5f',
    },
    {
      id: 'dc59fcd3-0a84-4726-a2ad-f07ce20f367a',
      key: 'MODERATE',
      name: 'Moderate Portfolio',
      description:
        'This portfolio is suitable for investors who are willing to take on a little bit of risk to increase marginally their returns. It has a mid to long-term investment time horizon.',
      expectedReturnPercent: '4',
      expectedVolatilityPercent: '7.5',
      reviewed: false,
      showSummaryStatistics: true,
      assetClassAllocation: [
        {
          included: true,
          assetClass: 'Equity',
          percentOfPortfolio: '25',
        },
        {
          included: true,
          assetClass: 'Money Market',
          percentOfPortfolio: '20',
        },
        {
          included: true,
          assetClass: 'Bonds',
          percentOfPortfolio: '55',
        },
        {
          included: true,
          assetClass: 'Other',
          percentOfPortfolio: '0',
        },
      ],
      riskProfileId: 'eeef55b0-40a7-4980-b8ec-a94e01be1d13',
    },
    {
      id: 'bca96485-8dc2-41fc-aabf-2a3f4745aab8',
      key: 'BALANCED',
      name: 'Balanced Portfolio',
      description:
        'This portfolio is suitable for investors who are seeking average returns and are ready to tolerate some price fluctuations. It has a mid to long-term investment time horizon.',
      expectedReturnPercent: '5',
      expectedVolatilityPercent: '11',
      reviewed: false,
      showSummaryStatistics: true,
      assetClassAllocation: [
        {
          included: true,
          assetClass: 'Equity',
          percentOfPortfolio: '50',
        },
        {
          included: true,
          assetClass: 'Money Market',
          percentOfPortfolio: '10',
        },
        {
          included: true,
          assetClass: 'Bonds',
          percentOfPortfolio: '40',
        },
        {
          included: true,
          assetClass: 'Other',
          percentOfPortfolio: '0',
        },
      ],
      riskProfileId: '4bf6874c-e5ea-4f66-b2f9-e1212b823422',
    },
    {
      id: '62f081f8-5220-441d-b262-c050da78602e',
      key: 'GROWTH',
      name: 'Growth Portfolio',
      description:
        'This portfolio is suitable for investors seeking growth and who are willing to take on higher risk. It has a long-term investment time horizon.',
      expectedReturnPercent: '6.5',
      expectedVolatilityPercent: '14.5',
      reviewed: false,
      showSummaryStatistics: true,
      assetClassAllocation: [
        {
          included: true,
          assetClass: 'Equity',
          percentOfPortfolio: '75',
        },
        {
          included: true,
          assetClass: 'Money Market',
          percentOfPortfolio: '5',
        },
        {
          included: true,
          assetClass: 'Bonds',
          percentOfPortfolio: '20',
        },
        {
          included: true,
          assetClass: 'Other',
          percentOfPortfolio: '0',
        },
      ],
      riskProfileId: 'e39f6a89-743f-4ed2-9307-22d5d545020c',
    },
    {
      id: '5aea8dfa-e6ed-467f-9541-34b19884ad8d',
      key: 'AGGRESSIVE',
      name: 'Aggressive Portfolio',
      description:
        'This portfolio is suitable for investors seeking high returns and who are willing to take on high risk. It has a long-term investment time horizon.',
      expectedReturnPercent: '8',
      expectedVolatilityPercent: '18',
      reviewed: false,
      showSummaryStatistics: true,
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
      riskProfileId: '149a15e6-7152-4a2d-9d16-0d6a0c70b825',
    },
  ];

const BASE_URL =
  'http://localhost:9000/api/v1/connect/investor/model-portfolios';
export const connectInvestorModelPortfoliosApiHandlers = [
  rest.get(`${BASE_URL}/summary`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectInvestorGetModelPortfoliosSummaryResponseDto>(
        mockGetModelPortfoliosSummaryResponse
      )
    );
  }),
];
