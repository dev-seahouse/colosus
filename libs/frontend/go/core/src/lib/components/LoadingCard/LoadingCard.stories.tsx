import type { Meta, StoryObj } from '@storybook/react';
import { LoadingCard } from './LoadingCard';

const meta: Meta<typeof LoadingCard> = {
  component: LoadingCard,
  title: 'core/components/LoadingCard',
};
export default meta;
type Story = StoryObj<typeof LoadingCard>;

export const Primary = {
  args: {},
};
