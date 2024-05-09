import type { Meta } from '@storybook/react';
import { ImageUpload } from './ImageUpload';

const Story: Meta<typeof ImageUpload> = {
  component: ImageUpload,
  title: 'ImageUpload',
};
export default Story;

export const Default = {
  args: {},
};

export const WithCustomUploadButtonLabel = {
  args: {
    UploadButtonProps: {
      label: 'Upload something here',
    },
  },
};

export const WithCustomRemoveButtonLabel = {
  args: {
    RemoveButtonProps: {
      label: 'Remove this image',
    },
  },
};

export const WithHelperText = {
  args: {
    helperText:
      'Choose a JPEG / PNG image with a minimum resolution of 300 x 300px',
  },
};
