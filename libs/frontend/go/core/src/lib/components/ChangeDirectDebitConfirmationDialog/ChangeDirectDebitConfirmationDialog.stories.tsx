import type { Meta, StoryObj } from '@storybook/react';
import { ChangeDirectDebitConfirmationDialog } from './ChangeDirectDebitConfirmationDialog';

const meta: Meta<typeof ChangeDirectDebitConfirmationDialog> = {
  component: ChangeDirectDebitConfirmationDialog,
  title: 'investing/components/ChangeDirectDebitConfirmationDialog',
};
export default meta;
type Story = StoryObj<typeof ChangeDirectDebitConfirmationDialog>;

export const Primary = {
  args: {
    open: true,
  },
};
