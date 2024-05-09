import type { Meta, StoryObj } from '@storybook/react';
import { PaymentSettingsGoalCard } from './PaymentSettingsGoalCard';

const meta: Meta<typeof PaymentSettingsGoalCard> = {
  component: PaymentSettingsGoalCard,
  title: 'investing/components/PaymentSettingsGoalCard',
};
export default meta;

type Story = StoryObj<typeof PaymentSettingsGoalCard>;

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

export const DataError = {
  args: {},
};
