import type { Meta, StoryObj } from '@storybook/react';
import { BoxWithLightenedPrimaryColor } from './BoxWithLightenedPrimaryColor';
import { Box } from '@bambu/react-ui';

const meta: Meta<typeof BoxWithLightenedPrimaryColor> = {
  component: BoxWithLightenedPrimaryColor,
  title: 'Core/components/BoxWithLightenedPrimaryColor',
};

export default meta;

type Story = StoryObj<typeof BoxWithLightenedPrimaryColor>;

export const Primary: Story = {
  args: {
    children: (
      <Box width="200px" height="200px">
        <h1>Title</h1>
      </Box>
    ),
  },
};
