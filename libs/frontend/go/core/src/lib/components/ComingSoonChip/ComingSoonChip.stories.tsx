import type { Meta, StoryObj } from '@storybook/react';
import { ComingSoonChip } from './ComingSoonChip';

const meta: Meta<typeof ComingSoonChip> = {
  component: ComingSoonChip,
  title: 'Core/components/ComingSoonChip',
};
export default meta;
type Story = StoryObj<typeof ComingSoonChip>;

export const Primary = {
  args: {},
};
