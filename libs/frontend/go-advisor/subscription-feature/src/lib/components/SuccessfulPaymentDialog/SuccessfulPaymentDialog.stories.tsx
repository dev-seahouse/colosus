import type { Meta } from '@storybook/react';
import { SuccessfulPaymentDialog } from './SuccessfulPaymentDialog';

const Story: Meta<typeof SuccessfulPaymentDialog> = {
  component: SuccessfulPaymentDialog,
  title: 'Subscription/components/SuccessfulPaymentDialog',
};
export default Story;

export const Default = {
  args: {
    open: true,
  },
};
