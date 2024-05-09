import type { Meta } from '@storybook/react';

import { TextField } from './TextField';

const Story: Meta<typeof TextField> = {
  component: TextField,
  title: 'TextField',
};
export default Story;

export const Primary = {
  args: {
    label: 'Label',
    helperText: 'Supporting text',
  },
};
