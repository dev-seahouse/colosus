import type { Meta } from '@storybook/react';

import { Typography } from './Typography';

const Story: Meta<typeof Typography> = {
  component: Typography,
  title: 'Typography',
};
export default Story;

export const Default = {
  args: {
    children: "I'm a Typography",
  },
};

export const CenterMobile = {
  args: {
    children: 'Switch to mobile view to see',
    centerOnMobile: true,
  },
};
