import type { Meta, StoryObj } from '@storybook/react';
import { WealthKernelContactInfoDialog } from './WealthKernelContactInfoDialog';

const meta: Meta<typeof WealthKernelContactInfoDialog> = {
  component: WealthKernelContactInfoDialog,
  title: 'investing/components/WealthKernelContactInfoDialog',
};
export default meta;
type Story = StoryObj<typeof WealthKernelContactInfoDialog>;

export const Primary = {
  args: {
    open: true,
    onClose: () => null,
  },
};
