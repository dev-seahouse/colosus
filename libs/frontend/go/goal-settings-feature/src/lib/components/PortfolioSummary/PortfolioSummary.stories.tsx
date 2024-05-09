import type { Meta } from '@storybook/react';
import { PortfolioSummary } from './PortfolioSummary';

const Story: Meta<typeof PortfolioSummary> = {
  component: PortfolioSummary,
  title: 'goal-settings/components/PortfolioSummary',
};
export default Story;

export const Primary = {
  args: {},
};
