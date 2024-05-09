import type { Meta, StoryObj } from '@storybook/react';
import { PaymentSettingsForm } from './PaymentSettingsForm';

const meta: Meta<typeof PaymentSettingsForm> = {
  component: PaymentSettingsForm,
  title: 'investing/components/PaymentSettingsForm',
};
export default meta;
type Story = StoryObj<typeof PaymentSettingsForm>;

export const Primary: Story = {
  args: {},
  parameters: {
    reactRouter: {
      location: {
        pathParams: { goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f' },
      },
      routing: { path: '/goalDetails/:goalId' },
    },
  },
};
