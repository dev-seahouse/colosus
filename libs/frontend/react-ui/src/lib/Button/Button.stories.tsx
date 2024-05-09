import { Button } from './Button';
import type { Meta } from '@storybook/react';

const Story: Meta<typeof Button> = {
  component: Button,
  title: 'Button',
};
export default Story;

export const FilledButton = {
  args: {
    children: 'Button',
    variant: 'contained',
  },
};

export const FilledButtonLoading = {
  args: {
    children: 'Button',
    variant: 'contained',
    isLoading: true,
  },
};

export const OutlinedButton = {
  args: {
    children: 'Button',
    variant: 'outlined',
  },
};

export const OutlinedButtonLoading = {
  args: {
    children: 'Button',
    variant: 'outlined',
    isLoading: true,
  },
};

export const TextButton = {
  args: {
    children: 'Button',
    variant: 'text',
  },
};

export const TextButtonLoading = {
  args: {
    children: 'Button',
    variant: 'text',
    isLoading: true,
  },
};
