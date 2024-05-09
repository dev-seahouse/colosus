import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitMandateSetupPage } from './DirectDebitMandateSetupPage';

const meta: Meta<typeof DirectDebitMandateSetupPage> = {
  component: DirectDebitMandateSetupPage,
  title: 'investing/pages/DirectDebitMandateSetupPage',
};
export default meta;
type Story = StoryObj<typeof DirectDebitMandateSetupPage>;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      location: {
        pathParams: { goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f' },
      },
      routing: { path: '/direct-debit-mandate-setup/:goalId' },
    },
  },
};
