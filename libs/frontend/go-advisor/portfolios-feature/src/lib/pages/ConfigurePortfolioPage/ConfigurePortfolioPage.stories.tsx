import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';

import { ConfigurePortfolioPage } from './ConfigurePortfolioPage';

const Story: Meta<typeof ConfigurePortfolioPage> = {
  component: DashboardPage,
  title: 'Portfolios/pages/ConfigurePortfolioPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      routePath: '/dashboard/portfolios/:portfolioType',
      history: {
        pathParams: { portfolioType: 'CONSERVATIVE' },
      },
      outlet: {
        element: <ConfigurePortfolioPage />,
        loader: () => ({
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
              included: true,
              assetClass: 'Equity',
              percentOfPortfolio: '75',
            },
            {
              included: true,
              assetClass: 'Money Market',
              percentOfPortfolio: '18',
            },
            {
              included: true,
              assetClass: 'Bonds',
              percentOfPortfolio: '5',
            },
            {
              included: true,
              assetClass: 'Other',
              percentOfPortfolio: '2',
            },
          ],
        }),
      },
      routeParams: {
        portfolioType: 'CONSERVATIVE',
      },
    },
  },
};
