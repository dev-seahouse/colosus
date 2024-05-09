import type { Meta, StoryObj } from '@storybook/react';
import { PaymentSettingsPage } from './PaymentSettingsPage';

const meta: Meta<typeof PaymentSettingsPage> = {
  component: PaymentSettingsPage,
  title: 'investing/pages/PaymentSettingsPage',
};
export default meta;
type Story = StoryObj<typeof PaymentSettingsPage>;

export const Primary: Story = {
  args: {},
  parameters: {
    reactRouter: {
      location: {
        pathParams: { goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f' },
      },
      routing: { path: '/payment-settings/:goalId' },
    },
  },
};
