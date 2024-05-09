import type { Meta } from '@storybook/react';
import { LayoutWithProgress } from '@bambu/go-core';
import InvestorNamePage from './InvestorNamePage';

const Story: Meta<typeof InvestorNamePage> = {
  component: LayoutWithProgress,
  title: 'Onboarding/pages/InvestorNamePage',
};
export default Story;

export const Default = {
  args: {
    children: <InvestorNamePage />,
  },
};
