import { rest } from 'msw';

import type {
  ConnectAdvisorPortfolioRequestDto,
  ConnectAdvisorGetPortfoliosResponseDto,
} from '../PortfolioSummary';

const BASE_URL =
  'http://localhost:9000/api/v1/connect/advisor/portfolio-summary';

export const connectAdvisorPortfolioSummaryApiHandlers = [
  rest.get(BASE_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<ConnectAdvisorGetPortfoliosResponseDto>({
        portfolioSummaries: [
          {
            key: 'CONSERVATIVE',
            name: 'Conservative Portfolio',
            description:
              'This portfolio primarily looks to preserve capital through a conservative asset allocation.',
            expectedReturnPercent: '4',
            expectedVolatilityPercent: '3.5',
            reviewed: true,
            showSummaryStatistics: true,
            assetClassAllocation: [
              {
                assetClass: 'Equity',
                percentOfPortfolio: '3.5',
                included: true,
              },
            ],
            riskProfileId: 'b6739bd8-6267-4bf7-bb1f-e112c54bec71',
          },
        ],
      })
    );
  }),
  rest.post<ConnectAdvisorPortfolioRequestDto>(BASE_URL, (req, res, ctx) => {
    return res(ctx.status(204));
  }),
];
