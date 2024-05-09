import type { Meta, StoryObj } from '@storybook/react';
import { GoalCardHeader } from './GoalCardHeader';

const meta: Meta<typeof GoalCardHeader> = {
  component: GoalCardHeader,
  title: 'dashboard/components/GoalCardHeader',
};
export default meta;
type Story = StoryObj<typeof GoalCardHeader>;

export const Primary = {
  args: {},
};
