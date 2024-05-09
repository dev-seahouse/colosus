import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonLoading } from './SkeletonLoading';

const meta: Meta<typeof SkeletonLoading> = {
  component: SkeletonLoading,
  title: 'Core/Components/SkeletonLoading',
};
export default meta;
type Story = StoryObj<typeof SkeletonLoading>;

// used for large component section loading, use this if the component is at least 1/4 of the screen
export const Primary = {
  args: {},
};

// for small components, use this for cards, etc
export const Small = {
  args: {
    variant: 'small',
  },
};

export const FullScreen = {
  args: {
    variant: 'full',
  },
};
