import type { Meta } from '@storybook/react';
import { LayoutWithProgress } from '@bambu/go-core';
import { InvestorCashSavingsPage } from './InvestorCashSavingsPage';

const Story: Meta<typeof InvestorCashSavingsPage> = {
  component: LayoutWithProgress,
  title: 'Onboarding/pages/InvestorCashSavingsPage',
};
export default Story;

export const Default = {
  args: {
    children: <InvestorCashSavingsPage />,
  },
};
