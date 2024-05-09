import type { Meta } from '@storybook/react';
import { LayoutWithProgress } from '@bambu/go-core';
import { InvestorAgePage } from './InvestorAgePage';

const Story: Meta<typeof InvestorAgePage> = {
  component: LayoutWithProgress,
  title: 'Onboarding/pages/InvestorAgePage',
};
export default Story;

export const Default = {
  args: {
    children: <InvestorAgePage />,
  },
};
