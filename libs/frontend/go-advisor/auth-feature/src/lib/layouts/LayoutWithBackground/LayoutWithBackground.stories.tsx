import type { Meta } from '@storybook/react';
import { LayoutWithBackground } from './LayoutWithBackground';

const Story: Meta<typeof LayoutWithBackground> = {
  component: LayoutWithBackground,
  title: 'Auth/layouts/LayoutWithBackground',
};
export default Story;

export const Primary = {
  args: {},
  parameters: {
    reactRouter: {
      outlet: <p>Sub-route goes here</p>,
    },
  },
};
