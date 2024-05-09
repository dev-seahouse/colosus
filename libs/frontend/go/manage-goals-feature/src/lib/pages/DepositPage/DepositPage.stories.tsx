import type { Meta, StoryObj } from '@storybook/react';
import { DepositPage } from './DepositPage';

const meta: Meta<typeof DepositPage> = {
  component: DepositPage,
  title: 'manage-goals/pages/DepositPage',
};
export default meta;
type Story = StoryObj<typeof DepositPage>;

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
