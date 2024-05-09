import type { Meta, StoryObj } from '@storybook/react';
import { useCoreStore } from '@bambu/go-core';
import { GoalInsightPage } from './GoalInsightPage';

const Story: Meta<typeof GoalInsightPage> = {
  component: GoalInsightPage,
  title: 'GoalInsightPage',
};
export default Story;

type GoalInsightPageStory = StoryObj<typeof GoalInsightPage>;

export const AverageLead: GoalInsightPageStory = {
  args: {},
  decorators: [
    (Story) => {
      useCoreStore.setState({ incomePerAnnum: 50000 });

      return Story();
    },
  ],
};

export const GoodLead: GoalInsightPageStory = {
  args: {},
  decorators: [
    (Story) => {
      useCoreStore.setState({ incomePerAnnum: 120000 });

      return Story();
    },
  ],
};
