import type { Meta } from '@storybook/react';
import { AnnualIncomeForm } from './AnnualIncomeForm';

const Story: Meta<typeof AnnualIncomeForm> = {
  component: AnnualIncomeForm,
  title: 'Onboarding/components/AnnualIncomeForm',
};
export default Story;

export const Primary = {
  args: {},
};
