import type { Meta } from '@storybook/react';
import { SkeletonLoading } from './SkeletonLoading';

const Story: Meta<typeof SkeletonLoading> = {
  component: SkeletonLoading,
  title: 'apps/SkeletonLoading',
};
export default Story;

export const Primary = {
  args: {},
};
