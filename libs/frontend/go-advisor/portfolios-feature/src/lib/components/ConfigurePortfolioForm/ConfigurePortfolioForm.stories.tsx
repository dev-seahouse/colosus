import type { Meta } from '@storybook/react';
import { ConfigurePortfolioForm } from './ConfigurePortfolioForm';

const Story: Meta<typeof ConfigurePortfolioForm> = {
  component: ConfigurePortfolioForm,
  title: 'Portfolios/components/ConfigurePortfolioForm',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      location: {
        pathParams: { portfolioType: 'CONSERVATIVE' },
      },
      routing: { path: '/dashboard/portfolios/:portfolioType' },
      routeParams: {
        portfolioType: 'CONSERVATIVE',
      },
    },
  },
};
