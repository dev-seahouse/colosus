import type { StoryObj, Meta } from '@storybook/react';
import MenuItem from '@mui/material/MenuItem';

import { Select } from './Select';

const Story: Meta<typeof Select> = {
  component: Select,
  title: 'Select',
};
export default Story;

export const Primary: StoryObj<typeof Select> = {
  render: (args) => (
    <Select label="Select" {...args}>
      <MenuItem value="label">Label</MenuItem>
    </Select>
  ),
  args: {},
};
