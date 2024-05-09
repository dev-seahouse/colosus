import type { Meta } from '@storybook/react';

import { GrowMyWealthFlowPage } from './GrowMyWealthFlowPage';
import GrowMyWealthForm from '../../components/GrowMyWealthForm/GrowMyWealthForm';
import InvestmentResult from '../../components/InvestmentResult/InvestmentResult';

const Story: Meta<typeof GrowMyWealthFlowPage> = {
  component: GrowMyWealthFlowPage,
  title: 'goal-settings/pages/GrowMyWealthFlowPage',
};
export default Story;

export const Amount = {
  args: {
    children: <GrowMyWealthForm />,
  },
};
export const RetirementInvestmentResult = {
  args: {
    children: <InvestmentResult />,
  },
};
