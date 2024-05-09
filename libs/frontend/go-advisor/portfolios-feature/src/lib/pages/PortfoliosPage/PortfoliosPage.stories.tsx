import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';

import { PortfoliosPage } from './PortfoliosPage';

const Story: Meta<typeof PortfoliosPage> = {
  component: DashboardPage,
  title: 'Portfolios/pages/PortfoliosPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <PortfoliosPage />,
      routePath: '/dashboard/portfolios',
    },
  },
};
