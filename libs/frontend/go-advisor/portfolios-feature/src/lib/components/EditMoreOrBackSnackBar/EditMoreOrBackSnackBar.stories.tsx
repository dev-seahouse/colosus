import type { Meta, StoryObj } from '@storybook/react';
import EditMoreOrBackSnackBar from './EditMoreOrBackSnackBar';

const meta: Meta<typeof EditMoreOrBackSnackBar> = {
  component: EditMoreOrBackSnackBar,
  title: 'EditMoreOrBackSnackBar',
};
export default meta;
type Story = StoryObj<typeof EditMoreOrBackSnackBar>;

export const Primary = {
  args: {},
};
