import type { Meta, StoryObj } from '@storybook/react';
import { WithdrawalPage } from './WithdrawalPage';

const meta: Meta<typeof WithdrawalPage> = {
  component: WithdrawalPage,
  title: 'manage-goals/pages/WithdrawalPage',
};
export default meta;
type Story = StoryObj<typeof WithdrawalPage>;

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
