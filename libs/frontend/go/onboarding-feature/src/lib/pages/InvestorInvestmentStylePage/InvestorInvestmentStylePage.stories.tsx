import { LayoutWithProgress } from '@bambu/go-core';
import { InvestorInvestmentStylePage } from './InvestorInvestmentStylePage';

const Story = {
  component: LayoutWithProgress,
  title: 'Onboarding/pages/InvestorInvestmentStylePage',
};
export default Story;

export const Primary = {
  args: {
    children: <InvestorInvestmentStylePage />,
  },
};
