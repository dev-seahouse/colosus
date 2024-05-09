import type { Meta, StoryObj } from '@storybook/react';
import { WithdrawalForm } from './WithdrawalForm';

const meta: Meta<typeof WithdrawalForm> = {
  component: WithdrawalForm,
  title: 'manage-goals/components/WithdrawalForm',
};
export default meta;
type Story = StoryObj<typeof WithdrawalForm>;

export const Primary = {
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
