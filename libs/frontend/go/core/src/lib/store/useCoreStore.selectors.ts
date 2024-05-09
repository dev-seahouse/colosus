import type { ConnectInvestorSaveLeadRequestDto } from '@bambu/api-client';
import { useApiStore } from '@bambu/api-client';

import useCoreStore from './useCoreStore';
import { DateTime } from 'luxon';

// TODO: break this down by selectors
/**
 * returns the onboarding progress value
 */

export const useSelectIsUserLoggedIn = () => {
  // refresh token is retrieved only when user makes an api call, when user is idle, session will be expired with expired refresh token
  return useApiStore(
    (state) =>
      state.accessToken !== null &&
      DateTime.fromISO(state.accessTokenExpiresAt as string)
        .diffNow()
        .as('milliseconds') >= 0
  );
};

export const useSelectProgress = () => {
  return useCoreStore((state) => state.layout.progress);
};

/**
 * returns function to set onboarding progress
 */
export const useSelectSetProgress = () => {
  return useCoreStore((state) => state.layout.setProgress);
};

/**
 * returns the show back button value
 */
export const useSelectShowBackButton = () => {
  return useCoreStore((state) => state.layout.showBackButton);
};

/**
 * returns function to set show back button
 */
export const useSelectSetShowBackButton = () => {
  return useCoreStore((state) => state.layout.setShowBackButton);
};

/**
 * returns function to reset layout state
 */
export const useSelectResetLayoutState = () => {
  return useCoreStore((state) => state.layout.resetLayoutState);
};

/**
 * returns function to show/hide back button
 */
export const selectSetShowBackButton = () => (showBackButton: boolean) => {
  useCoreStore.setState((state) => ({
    layout: { ...state.layout, showBackButton },
  }));
};

/**
 * hook to get user's postal code
 */
export const useSelectZipCode = () => {
  return useCoreStore((state) => state.zipCode ?? '');
};

/**
 * hook to get function to set user data
 */
export const useSelectSetUserData = () => {
  return useCoreStore((state) => state.setUserData);
};

/**
 * hook to get user's name
 */
export const useSelectName = () => {
  return useCoreStore((state) => state.name ?? undefined);
};

/*
 * hook to get user's email
 */
export const useSelectEmail = () => {
  return useCoreStore((state) => state.email ?? undefined);
};

/**
 * hook to get user's age
 */
export const useSelectAge = () => {
  return useCoreStore((state) => state.age ?? undefined);
};

/**
 * hook to get user's annual income
 */
export const useSelectIncomePerAnnum = () => {
  return useCoreStore((state) => state.incomePerAnnum ?? undefined);
};

/*
 * hook to get user's monthly savings
 */
export const useSelectMonthlySavings = () => {
  return useCoreStore((state) => state.monthlySavings ?? undefined);
};

/**
 * hook to get user's selected risk appetite
 */
export const useSelectRiskAppetite = () => {
  return useCoreStore((state) => state.riskAppetite ?? undefined);
};

export const useSelectRiskProfileId = () => {
  return useCoreStore((state) => state.riskProfileId ?? undefined);
};

/**
 * hook to get user's current savings
 */
export const useSelectCurrentSavings = () => {
  return useCoreStore((state) => state.currentSavings ?? undefined);
};

export const useSelectGoal = () => {
  return useCoreStore((state) => state.goal);
};

/**
 * hook to get user's goal type
 */
export const useSelectGoalType = () => {
  return useCoreStore((state) => state.goal.goalType);
};

/**
 * hook to get user's goal name
 */
export const useSelectGoalName = () => {
  return useCoreStore((state) => state.goal.goalName);
};

/**
 * hook to get user's goal timeframe
 */
export const useSelectGoalTimeframe = () => {
  return useCoreStore((state) => state.goal.goalTimeframe) ?? 0;
};

/**
 * hook to get user's goal target year based on timeframe
 */
export const useSelectGoalTargetYear = () => {
  const goalTimeframe = useSelectGoalTimeframe();

  return new Date().getFullYear() + goalTimeframe;
};

/**
 * hook to get user's goal value
 */
export const useSelectGoalValue = () => {
  return useCoreStore((state) => state.goal.goalValue) ?? 0;
};

/**
 * hook to get user's initial investment
 */
export const useSelectInitialInvestment = () => {
  return useCoreStore((state) => state.goal.initialInvestment);
};

/**
 * hook to get user's monthly contribution
 */
export const useSelectMonthlyContribution = () => {
  return useCoreStore((state) => state.goal.monthlyContribution);
};

/**
 * hook to get function to update user's goal
 */
export const useSelectUpdateGoalData = () => {
  return useCoreStore((state) => state.goal.updateGoalData);
};

/**
 * hook to get function to update user's projected returns data
 */
export const useSelectUpdateProjectedReturnsData = () => {
  return useCoreStore((state) => state.goal.updateProjectedReturnData);
};

/**
 * hook to get stored data to be sent to create lead API,
 * omitted value will be passed via form
 */
export const useSelectSaveLeadPayload = (): Omit<
  ConnectInvestorSaveLeadRequestDto,
  | 'email'
  | 'name'
  | 'phoneNumber'
  | 'sendGoalProjectionEmail'
  | 'sendAppointmentEmail'
  | 'riskAppetite' // modelPortfolioId
> => {
  const state = useCoreStore((state) => state);
  const riskQuestionnaire = useCoreStore((state) => state.riskQuestionnaire);
  const hasSelectedRiskQuestionnaire = useCoreStore(
    (state) => state.hasSelectedRiskQuestionnaire
  );

  return {
    age: state.age as number,
    currentSavings: state.currentSavings ?? 0,
    goalName: state.goal.goalType as string,
    goalTimeframe: state.goal.goalTimeframe as number,
    goalValue: state.goal.goalValue ?? 0,
    incomePerAnnum: state.incomePerAnnum ?? 0,
    monthlySavings: state.monthlySavings ?? 0,
    zipCode: state.zipCode as string,
    goalDescription: state.goal.goalName as string,
    isRetired: state.incomePerAnnum === null,
    initialInvestment: state.goal.initialInvestment ?? 0,
    monthlyContribution: state.goal.monthlyContribution ?? 0,
    recommendedMonthlyContribution:
      state.goal.recommendedMonthlyContribution ?? 0, // check out useSelectUpdateProjectedRecommendation, came from there, called by InvestNow and SendFinancialPlan button
    projectedReturns: {
      high: state.goal.projectedReturns.high ?? 0,
      target: state.goal.projectedReturns.target ?? 0,
      low: state.goal.projectedReturns.low ?? 0,
    },
    ...(hasSelectedRiskQuestionnaire
      ? {
          riskProfileCompliance: {
            questionnaireId: riskQuestionnaire?.questionnaireId,
            questionnaireVersion: riskQuestionnaire?.questionnaireVersion,
            answers: [...(riskQuestionnaire?.questionnaireAnswers ?? [])],
          },
        }
      : {}),
  };
};

/**
 * hook to set risk profile questionnaire selection
 */
export const useSelectSetHasSelectedRiskQuestionnaire = () => {
  return useCoreStore((state) => state.setHasSelectedRiskQuestionnaire);
};

/**
 * hook to store questionnaire answer
 */
export const useSelectUpdateRiskQuestionnaire = () => {
  return useCoreStore((state) => state.updateRiskQuestionnaire);
};

/*
 * hook to get all questionnaire answers
 */
export const useSelectGetRiskQuestionnaire = () => {
  return useCoreStore((state) => state.riskQuestionnaire);
};
