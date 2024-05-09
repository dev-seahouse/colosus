import type { Meta, StoryObj } from '@storybook/react';
import { DepositForm } from './DepositForm';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof DepositForm> = {
  component: DepositForm,
  title: 'manage-goals/components/DepositForm',
};
export default meta;
type Story = StoryObj<typeof DepositForm>;

export const Primary = {
  args: {},
  decorators: [hookFormDecorator()],
  parameters: {
    reactRouter: {
      location: {
        pathParams: { goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f' },
      },
      routing: { path: '/goalDetails/:goalId' },
    },
  },
};
