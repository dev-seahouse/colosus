import type { Meta } from '@storybook/react';
import { PortfolioDetails } from './PortfolioDetails';

const Story: Meta<typeof PortfolioDetails> = {
  component: PortfolioDetails,
  title: 'manage-goals/components/PortfolioDetails',
};
export default Story;

export const Primary = {
  args: {
    portfolioID: 'id',
  },
};

export const ErrorState = {
  args: {
    portfolioID: 'invalid',
  },
};
