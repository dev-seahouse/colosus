import type { Meta } from '@storybook/react';
import { HouseFlowPage } from './HouseFlowPage';

import DownPaymentForm from '../../components/DownPaymentForm/DownPaymentForm';
import PurchaseYearForm from '../../components/PurchaseYearForm/PurchaseYearForm';
import InvestmentResult from '../../components/InvestmentResult/InvestmentResult';

const Story: Meta<typeof HouseFlowPage> = {
  component: HouseFlowPage,
  title: 'goal-settings/pages/HouseFlowPage',
};
export default Story;

export const DownPayment = {
  args: {
    children: <DownPaymentForm />,
  },
};

export const PurchaseYear = {
  args: {
    children: <PurchaseYearForm />,
  },
};

export const RetirementInvestmentResult = {
  args: {
    children: <InvestmentResult />,
  },
};
