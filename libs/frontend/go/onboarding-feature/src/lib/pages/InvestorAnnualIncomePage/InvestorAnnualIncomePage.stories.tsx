import type { Meta } from '@storybook/react';
import { LayoutWithProgress } from '@bambu/go-core';
import { InvestorAnnualIncomePage } from './InvestorAnnualIncomePage';

const Story: Meta<typeof InvestorAnnualIncomePage> = {
  component: LayoutWithProgress,
  title: 'Onboarding/pages/InvestorAnnualIncomePage',
};
export default Story;

export const Default = {
  args: {
    children: <InvestorAnnualIncomePage />,
  },
};
