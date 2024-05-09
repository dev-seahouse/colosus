import type { Meta, StoryObj } from '@storybook/react';
import { GIABenefitsDialog } from './GIABenefitsDialog';

const meta: Meta<typeof GIABenefitsDialog> = {
  component: GIABenefitsDialog,
  title: 'investing/components/GIABenefitsDialog',
};
export default meta;
type Story = StoryObj<typeof GIABenefitsDialog>;

export const Primary = {
  args: {
    open: true,
  },
};
