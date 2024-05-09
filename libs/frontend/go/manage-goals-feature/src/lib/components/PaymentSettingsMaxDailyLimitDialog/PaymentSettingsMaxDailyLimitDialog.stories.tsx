import type { Meta, StoryObj } from '@storybook/react';
import { PaymentSettingsMaxDailyLimitDialog } from './PaymentSettingsMaxDailyLimitDialog';

const meta: Meta<typeof PaymentSettingsMaxDailyLimitDialog> = {
  component: PaymentSettingsMaxDailyLimitDialog,
  title: 'manage-goals/components/PaymentSettingsMaxDailyLimitModal',
};
export default meta;
type Story = StoryObj<typeof PaymentSettingsMaxDailyLimitDialog>;

export const Primary = {
  args: {
    open: true,
  },
};
