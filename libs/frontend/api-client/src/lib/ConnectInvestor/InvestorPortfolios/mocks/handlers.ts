import { rest } from 'msw';
import type { ConnectInvestorGetInvestorPortfolioDetailsResponseDto } from '../InvestorPortfolio';

const mockGetInvestorPortfolioDetailsResponse: ConnectInvestorGetInvestorPortfolioDetailsResponseDto =
  {
    id: 'ff2693ce-7773-4bdf-913d-5f042b9c5893',
    key: 'CONSERVATIVE',
    name: 'Conservative Portfolio',
    description:
      'This portfolio primarily looks to preserve capital through a conservative asset allocation.',
    expectedReturnPercent: '4',
    expectedVolatilityPercent: '3.5',
    products: [
      {
        name: 'AGF globalsustainable Growth Fund',
        ticker: 'IWDA',
        assetClass: 'MF',
        assetUnits: 4.5,
        assetCurrentValue: 7200,
      },
      {
        name: 'Quantified Alternative Investment',
        ticker: 'VOO',
        assetClass: 'MF',
        assetUnits: 4.5,
        assetCurrentValue: 7200,
      },
      {
        name: 'Quantified Managed Income',
        ticker: 'IWDA',
        assetClass: 'MF',
        assetUnits: 4.5,
        assetCurrentValue: 7200,
      },
      {
        name: 'Tradeweb for US Government Securitiesreate Bond ETF - USD',
        ticker: 'SPX',
        assetClass: 'MF',
        assetUnits: 0.21,
        assetCurrentValue: 103,
      },
      {
        name: 'US Dollar Holdings in Portfolio',
        assetClass: 'Cash',
        assetCurrentValue: 100,
      },
    ],
    riskProfileId: 'b6739bd8-6267-4bf7-bb1f-e112c54bec71',
    factSheetLink: 'https://google.com',
  };

const BASE_URL =
  'http://localhost:9000/api/v1/connect/investor/investor-portfolios';
export const connectInvestorModelPortfolioDetailsApiHandlers = [
  rest.get(`${BASE_URL}/id/details`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectInvestorGetInvestorPortfolioDetailsResponseDto>(
        mockGetInvestorPortfolioDetailsResponse
      )
    );
  }),
];
