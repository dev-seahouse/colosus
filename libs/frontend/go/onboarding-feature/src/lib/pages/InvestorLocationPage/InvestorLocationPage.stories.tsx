import type { Meta } from '@storybook/react';
import { LayoutWithProgress } from '@bambu/go-core';
import { InvestorLocationPage } from './InvestorLocationPage';

const Story: Meta<typeof InvestorLocationPage> = {
  component: LayoutWithProgress,
  title: 'Onboarding/pages/InvestorLocationPage',
};
export default Story;

export const Default = {
  args: {
    children: <InvestorLocationPage />,
  },
};
