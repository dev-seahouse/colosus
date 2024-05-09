import type { UseCoreStore } from '@bambu/go-core';
import {
  getNormalizedRecommendedRsp,
  useSelectUpdateGoalData,
  useSelectUpdateProjectedReturnsData,
} from '@bambu/go-core';

import useGoalSettingsStore from './useGoalSettingsStore';
import type { GrowMyWealthState } from './slices/growMyWealthSlice';
import type { OtherState } from './slices/otherSlice';
import type { EducationState } from './slices/educationSlice';
import type { RetirementState } from './slices/retirementSlice';
import type { HouseState } from './slices/houseSlice';
import {
  useSelectContributionRecommendationQuery,
  useSelectProjectedRecommendationQuery,
} from '../hooks/useGetOptimizedProjection/useGetOptimizedProjection.selectors';

import type { UseGetOptimizedProjectionOptions } from '../hooks/useGetOptimizedProjection/useGetOptimizedProjection';

type WithGoalValue<T> = Pick<UseCoreStore['goal'], 'goalValue'> & T;

/**
 * hook to get the goalName from the growMyWealth slice
 */
export const useSelectGrowMyWealthGoalName = () => {
  return useGoalSettingsStore((state) => state.growMyWealth.goalName);
};

// /**
//  * hook to get the initialInvestment from the growMyWealth slice
//  */
// export const useSelectGrowMyWealthInitialInvestment = () => {
//   return useGoalSettingsStore(
//     (state) => state.growMyWealth.initialInvestment ?? undefined
//   );
// };
//
/**
 * hook to get the goalYear from the growMyWealth slice
 */
export const useSelectGrowMyWealthGoalYear = () => {
  return useGoalSettingsStore(
    (state) => state.growMyWealth.goalYear ?? undefined
  );
};

/**
 * hook to get function to update growMyWealth data in store
 */
export const useSelectUpdateGrowMyWealthData = () => {
  return useGoalSettingsStore(
    (state) => state.growMyWealth.updateGrowMyWealthData
  );
};

/**
 * hook to update grow my wealth data in store & update core user goal data
 */
export const useSelectSubmitGrowMyWealthGoal = () => {
  const updateGrowMyWealthData = useSelectUpdateGrowMyWealthData();
  const updateGoalData = useSelectUpdateGoalData();
  const goalName = useSelectGrowMyWealthGoalName();

  return ({ goalYear }: Partial<GrowMyWealthState>) => {
    updateGrowMyWealthData({ goalYear });
    updateGoalData({
      goalName,
      goalTimeframe: (goalYear as number) - new Date().getFullYear(),
      goalType: 'Growing Wealth',
    });
  };
};

/**
 * hook to get the retirement age from the retirement slice
 */
export const useSelectRetirementAge = () => {
  return useGoalSettingsStore(
    (state) => state.retirement.retirementAge ?? undefined
  );
};

/**
 * hook to get function to update retirement data in store
 */
export const useSelectUpdateRetirementData = () => {
  return useGoalSettingsStore((state) => state.retirement.updateRetirementData);
};

/**
 * hook to get retirement goal name
 */
export const useSelectRetirementGoalName = () => {
  return useGoalSettingsStore((state) => state.retirement.goalName);
};

/**
 * hook to get function to update retirement data in store
 */
export const useSelectSubmitRetirementGoal = () => {
  const goalName = useSelectRetirementGoalName();
  const updateRetirementData = useSelectUpdateRetirementData();
  const updateGoalData = useSelectUpdateGoalData();

  return ({
    retirementAge,
    monthlyExpenses,
    goalValue,
    age,
  }: WithGoalValue<Partial<RetirementState> & { age: number }>) => {
    updateRetirementData({ retirementAge, monthlyExpenses });
    updateGoalData({
      goalName,
      goalTimeframe: (retirementAge as number) - age,
      goalValue,
      goalType: 'Retirement',
      initialInvestment: 0,
    });
  };
};

/**
 * hook to get the monthly expenses from the retirement slice
 */
export const useSelectRetirementMonthlyExpenses = () => {
  return useGoalSettingsStore(
    (state) => state.retirement.monthlyExpenses ?? undefined
  );
};

/**
 * hook to get education's goal name
 */
export const useSelectEducationGoalName = () => {
  return useGoalSettingsStore((state) => state.education.goalName);
};

/**
 * hook to get education's college start year
 */
export const useSelectEducationStartYear = () => {
  return useGoalSettingsStore((state) => state.education.collegeStartYear ?? 0);
};

/**
 * hook to get function to update education's data
 */
export const useSelectUpdateEducationData = () => {
  return useGoalSettingsStore((state) => state.education.updateEducationData);
};

/**
 * hook to get function to update education's data in store & update core goal data
 */
export const useSelectSubmitEducationGoal = () => {
  const updateEducationData = useSelectUpdateEducationData();
  const updateGoalData = useSelectUpdateGoalData();
  const goalValue = useSelectEducationFees();
  const goalName = useSelectEducationGoalName();

  return ({ collegeStartYear }: Partial<EducationState>) => {
    updateEducationData({ collegeStartYear });
    updateGoalData({
      goalName,
      goalTimeframe: Number(collegeStartYear) - new Date().getFullYear(),
      goalValue,
      initialInvestment: 0,
    });
  };
};

/**
 * hook to get education's fees
 */
export const useSelectEducationFees = () => {
  return useGoalSettingsStore(
    (state) => state.education.collegeFees ?? undefined
  );
};

/**
 * hook to get the goalName from the other slice
 */
export const useSelectOtherGoalName = () => {
  return useGoalSettingsStore((state) => state.other.goalName);
};

/**
 * hook to get function to update other goal data
 */
export const useSelectUpdateOtherData = () => {
  return useGoalSettingsStore((state) => state.other.updateOtherData);
};

/**
 * hook to get the goalValue from the other slice
 */
export const useSelectOtherGoalValue = () => {
  return useGoalSettingsStore((state) => state.other.goalValue ?? undefined);
};

/**
 * hook to get the goalYear from the other slice
 */
export const useSelectOtherGoalYear = () => {
  return useGoalSettingsStore((state) => state.other.goalYear ?? 0);
};

/**
 * hook to update other data in store & update core user goal data
 */
export const useSelectSubmitOtherGoal = () => {
  const updateOtherData = useSelectUpdateOtherData();
  const updateGoalData = useSelectUpdateGoalData();
  const goalName = useSelectOtherGoalName();
  const goalValue = useSelectOtherGoalValue();

  return ({ goalYear }: Partial<OtherState>) => {
    updateOtherData({ goalYear });
    updateGoalData({
      goalName,
      goalTimeframe: Number(goalYear) - new Date().getFullYear(),
      goalValue,
      goalType: 'Other',
      initialInvestment: 0,
    });
  };
};

/**
 * hook to get the goalName from the house slice
 */
export const useSelectHouseGoalName = () => {
  return useGoalSettingsStore((state) => state.house.goalName);
};

/**
 * hook to get function to update house goal data
 */
export const useSelectUpdateHouseData = () => {
  return useGoalSettingsStore((state) => state.house.updateHouseData);
};

/**
 * hook to get house downpayment percentage
 */
export const useSelectHouseDownPaymentPercentage = () => {
  return useGoalSettingsStore(
    (state) => state.house.downPaymentPercentage ?? ''
  );
};

/**
 * hook to get house price
 */
export const useSelectHousePrice = () => {
  return useGoalSettingsStore((state) => state.house.housePrice ?? undefined); // without ?? undefined, there will be type error in e.g  PurchaseYearForm
};

/**
 * hook to get house purchase year
 */
export const useSelectHousePurchaseYear = () => {
  return useGoalSettingsStore((state) => state.house.purchaseYear) ?? undefined;
};

/**
 * hook to update house data in store & update core user goal data
 */
export const useSelectSubmitHouseGoal = () => {
  const updateHouseData = useSelectUpdateHouseData();
  const updateGoalData = useSelectUpdateGoalData();
  const goalName = useSelectHouseGoalName();
  const housePrice = useSelectHousePrice() as number;
  const downPaymentPercentage = useSelectHouseDownPaymentPercentage();

  return ({ purchaseYear }: Partial<HouseState>) => {
    const goalValue = housePrice * (Number(downPaymentPercentage) / 100);

    updateHouseData({ purchaseYear });
    updateGoalData({
      goalName,
      goalTimeframe: Number(purchaseYear) - new Date().getFullYear(),
      goalValue,
      goalType: 'House',
      initialInvestment: 0,
    });
  };
};

/**
 * hook to update projected recommendation data in core store
 * it is used to prepare the recommendation payload for creating lead and creating account
 * @see InvestNow and SendFinancialPlan buttons
 */
export const useSelectUpdateProjectedRecommendation = ({
  initialData,
}: UseGetOptimizedProjectionOptions = {}) => {
  const { data: projectedReturns } = useSelectProjectedRecommendationQuery({
    initialData,
  });
  const { data: recommendedMonthlyContribution } =
    useSelectContributionRecommendationQuery({ initialData });

  const recommendedMonthlyContributionValue = getNormalizedRecommendedRsp(
    recommendedMonthlyContribution
  );

  const updateProjectedReturnsData = useSelectUpdateProjectedReturnsData();
  const updateGoalData = useSelectUpdateGoalData();

  return () => {
    updateGoalData({
      recommendedMonthlyContribution: recommendedMonthlyContributionValue,
    });
    updateProjectedReturnsData({
      low: projectedReturns?.projectionLowerAmt,
      target: projectedReturns?.projectionTargetAmt,
      high: projectedReturns?.projectionUpperAmt,
    });
  };
};
