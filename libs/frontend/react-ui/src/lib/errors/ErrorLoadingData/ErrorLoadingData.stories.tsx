import type { Meta } from '@storybook/react';
import { ErrorLoadingData } from './ErrorLoadingData';

const Story: Meta<typeof ErrorLoadingData> = {
  component: ErrorLoadingData,
  title: 'Core/components/errors/ErrorLoadingData',
};
export default Story;

export const Primary = {
  args: {},
};

export const WithDefaultAction = {
  args: {
    allowAction: true,
  },
};

export const WithCustomAction = {
  args: {
    title: 'An error occurred',
    description: 'This error indicator has a custom action',
    allowAction: true,
    actionButtonText: 'Who caused this error?',
    actionPrompt:
      'Obviously it also has custom title, description, and button captions',
    onActionClick: (e: any) => alert('Not too sure.'),
  },
};
