import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitConfirmBankDetailsCallout } from './DirectDebitConfirmBankDetailsCallout';

const meta: Meta<typeof DirectDebitConfirmBankDetailsCallout> = {
  component: DirectDebitConfirmBankDetailsCallout,
  title: 'investing/components/DirectDebitConfirmBankDetailsCallout',
};
export default meta;
type Story = StoryObj<typeof DirectDebitConfirmBankDetailsCallout>;

export const Primary = {
  args: {},
};
