import type { Meta, StoryObj } from '@storybook/react';
import { RetirementFlowPage } from './RetirementFlowPage';

import RetirementAgeForm from '../../components/RetirementAgeForm/RetirementAgeForm';
import RetirementMonthlyExpensesForm from '../../components/RetirementMonthlyExpensesForm/RetirementMonthlyExpensesForm';
import SetupContributionForm from '../../components/SetupContributionForm/SetupContributionForm';
import InvestmentStyleQuestionOne from '../../components/InvestmentStyleQuestionnaire/InvestmentStyleQuestionOne';
import InvestmentStyleQuestionTwo from '../../components/InvestmentStyleQuestionnaire/InvestmentStyleQuestionTwo';
import InvestmentStyleQuestionThree from '../../components/InvestmentStyleQuestionnaire/InvestmentStyleQuestionThree';
import InvestmentStyleQuestionFour from '../../components/InvestmentStyleQuestionnaire/InvestmentStyleQuestionFour';
import InvestmentResult from '../../components/InvestmentResult/InvestmentResult';
import { useCoreStore } from '@bambu/go-core';

type RetirementFlowPageStory = StoryObj<typeof RetirementFlowPage>;

const Story: Meta<typeof RetirementFlowPage> = {
  component: RetirementFlowPage,
  title: 'goal-settings/pages/RetirementFlowPage',
};
export default Story;

export const RetirementAge = {
  args: {
    children: <RetirementAgeForm />,
  },
};

export const RetirementMonthlyExpenses = {
  args: {
    children: <RetirementMonthlyExpensesForm />,
  },
};

export const RetirementContribution = {
  args: {
    children: <SetupContributionForm />,
  },
};

// user have previously selected "I don't know my risk profile"
// in such case, risk profile will be retieved from the computeRiskScore api
export const RetirementInvestmentResultDontKnowProfile: RetirementFlowPageStory =
  {
    args: {
      children: <InvestmentResult />,
    },
    parameters: {
      reactQuery: {
        enableDevtools: true,
      },
    },
  };

export const RetirementInvestmentResultKnowMyProfile: RetirementFlowPageStory =
  {
    args: {
      children: <InvestmentResult />,
    },
    parameters: {
      reactQuery: {
        enableDevtools: true,
      },
    },
    decorators: [
      (Story) => {
        useCoreStore.setState({
          hasSelectedRiskQuestionnaire: false,
        });
        return Story();
      },
    ],
  };

export const InvestmentStyleQnsOne = {
  args: {
    children: <InvestmentStyleQuestionOne />,
  },
};

export const InvestmentStyleQnsTwo = {
  args: {
    children: <InvestmentStyleQuestionTwo />,
  },
};
export const InvestmentStyleQnsThree = {
  args: {
    children: <InvestmentStyleQuestionThree />,
  },
};
export const InvestmentStyleQnsFour = {
  args: {
    children: <InvestmentStyleQuestionFour />,
  },
};
