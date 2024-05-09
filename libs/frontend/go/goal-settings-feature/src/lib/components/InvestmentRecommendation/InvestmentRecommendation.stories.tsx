import type { Meta, StoryObj } from '@storybook/react';
import { useCoreStore } from '@bambu/go-core';
import { InvestmentRecommendation } from './InvestmentRecommendation';
import useGoalSettingsStore from '../../store/useGoalSettingsStore';

const Story: Meta<typeof InvestmentRecommendation> = {
  component: InvestmentRecommendation,
  title: 'goal-Settings/components/InvestmentRecommendation',
};
export default Story;

type InvestmentRecommendationStory = StoryObj<typeof InvestmentRecommendation>;

export const Retirement: InvestmentRecommendationStory = {
  args: {},
  decorators: [
    (Story) => {
      useCoreStore.setState((state) => ({
        goal: {
          ...state.goal,
          goalType: 'Retirement',
          goalTimeframe: 5,
          goalValue: 100000,
        },
      }));
      return Story();
    },
  ],
};

export const GrowMyWealth: InvestmentRecommendationStory = {
  args: {},
  decorators: [
    (Story) => {
      useGoalSettingsStore.setState((state) => ({
        retirement: {
          ...state.retirement,
          retirementAge: 65,
        },
      }));
      useCoreStore.setState((state) => ({
        goal: {
          ...state.goal,
          goalType: 'Growing Wealth',
          goalTimeframe: 5,
          goalValue: 100000,
        },
      }));
      return Story();
    },
  ],
};

export const OtherGoal: InvestmentRecommendationStory = {
  args: {},
  decorators: [
    (Story) => {
      useCoreStore.setState((state) => ({
        goal: {
          ...state.goal,
          goalType: 'Other',
          goalTimeframe: 5,
          goalValue: 100000,
        },
      }));
      return Story();
    },
  ],
};
