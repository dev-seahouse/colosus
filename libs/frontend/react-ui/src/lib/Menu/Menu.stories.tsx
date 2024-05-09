import type { Meta, StoryObj } from '@storybook/react';
import MenuItem from '@mui/material/MenuItem';
import { Menu } from './Menu';

const Story: Meta<typeof Menu> = {
  component: Menu,
  title: 'Menu',
};
export default Story;

export const Default: StoryObj<typeof Menu> = {
  render: (args) => (
    <Menu open {...args}>
      <MenuItem>List Item</MenuItem>
      <MenuItem>List Item</MenuItem>
    </Menu>
  ),

  args: {
    open: true,
  },
};
