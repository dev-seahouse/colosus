import type { Meta, StoryObj } from '@storybook/react';
import { TransactionInProgressSnackBar } from './TransactionInProgressSnackBar';

const meta: Meta<typeof TransactionInProgressSnackBar> = {
  component: TransactionInProgressSnackBar,
  title: 'investing/components/TransactionInProgressSnackBar',
};
export default meta;
type Story = StoryObj<typeof TransactionInProgressSnackBar>;

export const Primary = {
  args: {},
};
