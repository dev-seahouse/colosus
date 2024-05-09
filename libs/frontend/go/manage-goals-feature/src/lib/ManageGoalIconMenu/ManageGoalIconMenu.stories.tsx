import type { Meta, StoryObj } from '@storybook/react';
import ManageGoalIconMenu from './ManageGoalIconMenu';

const meta: Meta<typeof ManageGoalIconMenu> = {
  component: ManageGoalIconMenu,
  title: 'manage-goals/components/ManageGoalIconMenu',
};
export default meta;
type Story = StoryObj<typeof ManageGoalIconMenu>;

export const Primary = {
  args: {},
};
