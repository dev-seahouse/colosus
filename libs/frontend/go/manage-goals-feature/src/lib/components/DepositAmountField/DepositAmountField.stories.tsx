import type { Meta, StoryObj } from '@storybook/react';
import { DepositAmountField } from './DepositAmountField';

const meta: Meta<typeof DepositAmountField> = {
  component: DepositAmountField,
  title: 'manage-goals/components/DepositAmountField',
};
export default meta;
type Story = StoryObj<typeof DepositAmountField>;

export const Primary = {
  args: {},
};
