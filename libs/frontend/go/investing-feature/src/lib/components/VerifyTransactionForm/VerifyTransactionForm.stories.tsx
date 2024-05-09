import type { Meta, StoryObj } from '@storybook/react';
import { VerifyTransactionForm } from './VerifyTransactionForm';

const meta: Meta<typeof VerifyTransactionForm> = {
  component: VerifyTransactionForm,
  title: 'investing/components/VerifyTransactionForm',
};
export default meta;
type Story = StoryObj<typeof VerifyTransactionForm>;

export const Primary = {
  args: {},
};
