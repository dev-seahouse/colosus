import type { Meta, StoryObj } from '@storybook/react';
import { BankAccountDetailsCallout } from './BankAccountDetailsCallout';

const meta: Meta<typeof BankAccountDetailsCallout> = {
  component: BankAccountDetailsCallout,
  title: 'core/components/BankAccountDetailsCallout',
};
export default meta;
type Story = StoryObj<typeof BankAccountDetailsCallout>;

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
