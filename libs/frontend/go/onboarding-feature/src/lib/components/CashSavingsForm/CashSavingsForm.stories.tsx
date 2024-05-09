import type { Meta } from '@storybook/react';
import { CashSavingsForm } from './CashSavingsForm';

const Story: Meta<typeof CashSavingsForm> = {
  component: CashSavingsForm,
  title: 'Onboarding/components/CashSavingsForm',
};
export default Story;

export const Primary = {
  args: {},
};
