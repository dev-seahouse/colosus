import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';

import { Slider } from './Slider';

const Story: Meta<typeof Slider> = {
  component: Slider,
  title: 'Slider',
};
export default Story;

export const Default: StoryObj<typeof Slider> = {
  render: (args) => (
    <Box sx={{ pt: 4 }}>
      <Slider {...args} />
    </Box>
  ),

  args: {
    defaultValue: 30,
  },
};
