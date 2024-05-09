import type { Meta, StoryObj } from '@storybook/react';
import { CancelRecurringDepositPage } from './CancelRecurringDepositPage';

const meta: Meta<typeof CancelRecurringDepositPage> = {
  component: CancelRecurringDepositPage,
  title: 'manage-goals/pages/CancelRecurringDepositPage',
};
export default meta;
type Story = StoryObj<typeof CancelRecurringDepositPage>;

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
