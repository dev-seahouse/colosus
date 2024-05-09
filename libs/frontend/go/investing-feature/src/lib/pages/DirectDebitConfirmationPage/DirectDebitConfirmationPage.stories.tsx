import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitConfirmationPage } from './DirectDebitConfirmationPage';

const meta: Meta<typeof DirectDebitConfirmationPage> = {
  component: DirectDebitConfirmationPage,
  title: 'investing/pages/DirectDebitConfirmationPage',
};
export default meta;
type Story = StoryObj<typeof DirectDebitConfirmationPage>;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      location: {
        pathParams: { goalId: '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f' },
      },
      routing: { path: '/direct-debit-confirm/:goalId' },
    },
  },
};

export const DataError = {
  args: {},
};
