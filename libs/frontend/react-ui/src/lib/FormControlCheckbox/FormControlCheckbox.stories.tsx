import type { Meta, StoryObj } from '@storybook/react';
import { FormControlCheckbox } from './FormControlCheckbox';
import { Box } from '@mui/material';

const meta: Meta<typeof FormControlCheckbox> = {
  component: FormControlCheckbox,
  title: 'FormControlCheckbox',
};
export default meta;

type Story = StoryObj<typeof FormControlCheckbox>;

export const Primary: Story = {
  args: {
    label: <Box>I agree to the terms and condition of Bambu </Box>,
  },
};

export const Error: Story = {
  args: {
    label: <Box>I agree to the terms and condition of Bambu </Box>,
    error: { message: 'error message here' },
  },
};
