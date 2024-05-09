import type { Meta } from '@storybook/react';
import { hookFormDecorator } from '@bambu/storybook-utils';
import { SubdomainConfirmationDialog } from './SubdomainConfirmationDialog';

const Story: Meta<typeof SubdomainConfirmationDialog> = {
  component: SubdomainConfirmationDialog,
  title: 'Profile/components/SubdomainConfirmationDialog',
};
export default Story;

export const Primary = {
  args: {
    open: true,
  },
  decorators: [
    hookFormDecorator({
      subdomain: 'bambu',
    }),
  ],
};
