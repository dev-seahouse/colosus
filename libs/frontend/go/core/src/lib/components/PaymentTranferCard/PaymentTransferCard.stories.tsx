import type { Meta, StoryObj } from '@storybook/react';
import { PaymentTransferCard } from './PaymentTransferCard';
import { hookFormDecorator } from '@bambu/storybook-utils';

const meta: Meta<typeof PaymentTransferCard> = {
  component: PaymentTransferCard,
  title: 'core/components/PaymentTransferCard',
};
export default meta;
type Story = StoryObj<typeof PaymentTransferCard>;

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
