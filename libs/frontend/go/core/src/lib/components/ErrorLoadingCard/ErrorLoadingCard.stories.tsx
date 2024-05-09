import type { Meta, StoryObj } from '@storybook/react';
import { ErrorLoadingCard } from './ErrorLoadingCard';

const meta: Meta<typeof ErrorLoadingCard> = {
  component: ErrorLoadingCard,
  title: 'core/components/ErrorLoadingCard',
};
export default meta;
type Story = StoryObj<typeof ErrorLoadingCard>;

export const Primary = {
  args: {},
};
