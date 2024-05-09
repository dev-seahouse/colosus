import type { Meta, StoryObj } from '@storybook/react';
import { DirectDebitGuaranteeDialog } from './DirectDebitGuaranteeDialog';

const meta: Meta<typeof DirectDebitGuaranteeDialog> = {
  component: DirectDebitGuaranteeDialog,
  title: 'investing/components/DirectDebitGuaranteeDialog',
};
export default meta;
type Story = StoryObj<typeof DirectDebitGuaranteeDialog>;

export const Primary = {
  args: {
    open: true,
  },
};
