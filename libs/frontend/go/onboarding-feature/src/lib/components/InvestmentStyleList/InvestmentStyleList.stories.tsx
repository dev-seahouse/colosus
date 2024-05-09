import type { Meta } from '@storybook/react';
import { InvestmentStyleList } from './InvestmentStyleList';

const Story: Meta<typeof InvestmentStyleList> = {
  component: InvestmentStyleList,
  title: 'Onboarding/components/InvestmentStyleList',
};
export default Story;

export const Primary = {
  args: {},
};
