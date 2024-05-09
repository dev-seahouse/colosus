import type { Meta } from '@storybook/react';
import { FileUpload } from './FileUpload';

const Story: Meta<typeof FileUpload> = {
  component: FileUpload,
  title: 'FileUpload',
};
export default Story;

export const Primary = {
  args: {
    helperText: 'helper text here',
  },
};
