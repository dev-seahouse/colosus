import type { Meta, StoryObj } from '@storybook/react';
import { VerifyTransactionPage } from './VerifyTransactionPage';

const meta: Meta<typeof VerifyTransactionPage> = {
  component: VerifyTransactionPage,
  title: 'investing/pages/VerifyTransactionPage',
};
export default meta;
type Story = StoryObj<typeof VerifyTransactionPage>;

export const Primary = {
  args: {},
};
