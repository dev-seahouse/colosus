import type { Meta, StoryObj } from '@storybook/react';
import { WithdrawalAmountField } from './WithdrawalAmountField';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof WithdrawalAmountField> = {
  component: WithdrawalAmountField,
  title: 'core/components/WithdrawalAmountField',
};
export default meta;
type Story = StoryObj<typeof WithdrawalAmountField>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator],
};
