import type { Meta } from '@storybook/react';
import { BrandingForm } from './BrandingForm';

const Story: Meta<typeof BrandingForm> = {
  component: BrandingForm,
  title: 'Branding/components/BrandingForm',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactQuery: {
      enableDevtools: true,
      setQueryData: {
        queryKey: 'getTenantBranding',
        data: {
          logoUrl: null,
          brandColor: '#00876A',
          headerBgColor: '#fff',
          tradeName: 'Wealth Avenue',
        },
      },
    },
  },
};
