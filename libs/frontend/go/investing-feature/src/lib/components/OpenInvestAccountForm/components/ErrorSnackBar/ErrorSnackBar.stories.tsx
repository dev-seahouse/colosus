import type { Meta, StoryObj } from '@storybook/react';
import { ErrorSnackBar } from './ErrorSnackBar';

const meta: Meta<typeof ErrorSnackBar> = {
  component: ErrorSnackBar,
  title: 'investing/components/ErrorSnackBar',
};
export default meta;
type Story = StoryObj<typeof ErrorSnackBar>;

export const Primary = {
  args: {},
};
