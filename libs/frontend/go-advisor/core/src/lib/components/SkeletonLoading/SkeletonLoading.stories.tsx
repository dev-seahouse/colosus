import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonLoading } from './SkeletonLoading';

const meta: Meta<typeof SkeletonLoading> = {
  component: SkeletonLoading,
  title: 'SkeletonLoading',
};
export default meta;
type Story = StoryObj<typeof SkeletonLoading>;

export const Primary = {
  args: {},
};
