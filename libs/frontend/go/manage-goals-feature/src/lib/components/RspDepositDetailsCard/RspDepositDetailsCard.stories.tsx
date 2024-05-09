import type { Meta, StoryObj } from '@storybook/react';
import { RspDepositDetailsCard } from './RspDepositDetailsCard';

const meta: Meta<typeof RspDepositDetailsCard> = {
  component: RspDepositDetailsCard,
  title: 'manage-goals/components/RspDepositDetailsCard',
};
export default meta;
type Story = StoryObj<typeof RspDepositDetailsCard>;

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
