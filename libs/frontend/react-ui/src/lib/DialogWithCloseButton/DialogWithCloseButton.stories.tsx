import type { Meta, StoryObj } from '@storybook/react';
import { DialogWithCloseButton } from './DialogWithCloseButton';

const meta: Meta<typeof DialogWithCloseButton> = {
  component: DialogWithCloseButton,
  title: 'DialogWithCloseButton',
};
export default meta;
type Story = StoryObj<typeof DialogWithCloseButton>;

export const Primary = {
  args: {},
};
