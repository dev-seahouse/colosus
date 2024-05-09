import type { Meta, StoryObj } from '@storybook/react';
import { EmptyTransaction } from './EmptyTransaction';

const meta: Meta<typeof EmptyTransaction> = {
  component: EmptyTransaction,
  title: 'manage-goals/components/EmptyTransaction',
};
export default meta;
type Story = StoryObj<typeof EmptyTransaction>;

export const Primary = {
  args: {},
};
