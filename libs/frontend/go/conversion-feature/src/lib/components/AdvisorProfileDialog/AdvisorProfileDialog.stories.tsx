import type { Meta } from '@storybook/react';
import { AdvisorProfileDialog } from './AdvisorProfileDialog';

const Story: Meta<typeof AdvisorProfileDialog> = {
  component: AdvisorProfileDialog,
  title: 'conversion/components/AdvisorProfileDialog',
};
export default Story;

export const Primary = {
  args: {
    open: true,
    onClose: () => alert('close button clicked'),
  },
};
