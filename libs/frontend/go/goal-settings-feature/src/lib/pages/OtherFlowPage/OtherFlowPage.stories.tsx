import type { Meta } from '@storybook/react';
import { OtherFlowPage } from './OtherFlowPage';

import OtherGoalNameForm from '../../components/OtherGoalNameForm/OtherGoalNameForm';
import OtherGoalAmountForm from '../../components/OtherGoalAmountForm/OtherGoalAmountForm';
import OtherGoalYearForm from '../../components/OtherGoalYearForm/OtherGoalYearForm';

const Story: Meta<typeof OtherFlowPage> = {
  component: OtherFlowPage,
  title: 'goal-settings/pages/OtherFlowPage',
};
export default Story;

export const GoalName = {
  args: {
    children: <OtherGoalNameForm />,
  },
};

export const GoalAmount = {
  args: {
    children: <OtherGoalAmountForm />,
  },
};

export const GoalYear = {
  args: {
    children: <OtherGoalYearForm />,
  },
};
