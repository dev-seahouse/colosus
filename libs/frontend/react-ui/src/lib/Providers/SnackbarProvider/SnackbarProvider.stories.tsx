import type { Meta, StoryObj } from '@storybook/react';
import { enqueueSnackbar } from 'notistack';
import { SnackbarProvider } from './SnackbarProvider';

const Story: Meta<typeof SnackbarProvider> = {
  component: SnackbarProvider,
  title: 'SnackbarProvider',
};
export default Story;

export const Primary: StoryObj<typeof SnackbarProvider> = {
  args: {},
  render: () => (
    <SnackbarProvider>
      <button
        onClick={() =>
          enqueueSnackbar('I am a snackbar', { variant: 'success' })
        }
      >
        show snackbar
      </button>
    </SnackbarProvider>
  ),
};
