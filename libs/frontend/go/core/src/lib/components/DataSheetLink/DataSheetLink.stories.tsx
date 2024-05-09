import type { Meta, StoryObj } from '@storybook/react';
import { DataSheetLink } from './DataSheetLink';

const meta: Meta<typeof DataSheetLink> = {
  component: DataSheetLink,
  title: 'core/components/DataSheetLink',
};
export default meta;
type Story = StoryObj<typeof DataSheetLink>;

export const Primary = {
  args: {
    factSheetUrl: 'https://www.google.com',
    name: 'Google',
  },
};
