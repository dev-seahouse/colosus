import type { Meta } from '@storybook/react';

import { ColorPicker } from './ColorPicker';

const Story: Meta<typeof ColorPicker> = {
  component: ColorPicker,
  title: 'ColorPicker',
};
export default Story;

export const Default = {
  args: {},
};
