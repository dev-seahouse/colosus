import type { Meta } from '@storybook/react';
import { DashboardPage } from '@bambu/go-advisor-core';

import { BrandingPage } from './BrandingPage';

const Story: Meta<typeof BrandingPage> = {
  component: DashboardPage,
  title: 'Branding/pages/BrandingPage',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <BrandingPage />,
      routePath: '/dashboard/branding',
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
