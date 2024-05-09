import type { Meta } from '@storybook/react';
import { SetupContributionRecommendation } from './SetupContributionRecommendation';

const Story: Meta<typeof SetupContributionRecommendation> = {
  component: SetupContributionRecommendation,
  title: 'goal-settings/components/SetupContributionRecommendation',
};

/**
 * when userInput is undefined or 0, default message will be shown
 */
export const Primary = {
  args: {
    isLoading: false,
    monthlySavings: 1000,
    recommendedRSP: 1000,
    userInputRSP: undefined,
  },
};

/** when goal-helper api is loading, loader animation is shown */
export const Loading = {
  args: {
    ...Primary.args,
    isLoading: true,
  },
};

/**
 * when user's RSP is equal or higher than recommended rsp
 */
export const RSPGood = {
  args: {
    isLoading: false,
    monthlySavings: 1000,
    recommendedRSP: 1000, //<- recommended rsp
    userInputRSP: 1001, //<- user' RSP
  },
};

//when recommended RSP is greater than monthly income
export const RSPLow = {
  args: {
    isLoading: false,
    monthlySavings: 999, //<- monthly income
    recommendedRSP: 1000, //<- recommended RSP
    userInputRSP: 1000,
  },
};

export const RecommendationBelow25 = {
  args: {
    isLoading: false,
    monthlySavings: 999,
    recommendedRSP: 10,
    userInputRSP: 0,
  },
};

export default Story;
