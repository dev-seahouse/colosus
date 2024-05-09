import type { Meta, StoryObj } from '@storybook/react';
import { RecommendationBanner } from './RecommendationBanner';

const meta: Meta<typeof RecommendationBanner> = {
  component: RecommendationBanner,
  title: 'core/components/RecommendationBanner',
};
export default meta;
type Story = StoryObj<typeof RecommendationBanner>;

export const Primary = {
  args: {},
};
