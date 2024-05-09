import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';
import { RiskQuestionnairePage } from './RiskQuestionnairePage';

const Story: Meta<typeof RiskQuestionnairePage> = {
  component: DashboardPage,
  title: 'RiskProfile/pages/RiskQuestionnairePage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <RiskQuestionnairePage />,
      routePath: '/risk-profile/questionnaire',
    },
    reactQuery: {
      enableDevtools: true,
      setQueryData: {
        queryKey: 'getTenantBranding',
        data: {
          tradeName: 'Wealth Avenue',
          brandColor: '#00876A',
          headerBgColor: '#fff',
          logoUrl: null,
        },
      },
    },
  },
};
