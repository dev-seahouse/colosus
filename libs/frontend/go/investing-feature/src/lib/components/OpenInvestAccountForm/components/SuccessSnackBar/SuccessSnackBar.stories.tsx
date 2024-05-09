import type { Meta, StoryObj } from '@storybook/react';
import { SuccessSnackBar } from './SuccessSnackBar';

const meta: Meta<typeof SuccessSnackBar> = {
  component: SuccessSnackBar,
  title: 'investing/components/SuccessSnackBar',
};
export default meta;
type Story = StoryObj<typeof SuccessSnackBar>;

export const Primary = {
  args: {},
};
