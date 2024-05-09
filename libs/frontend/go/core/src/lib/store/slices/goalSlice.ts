import type { CoreStoreStateCreator } from '../useCoreStore';
import type { GoalType } from '../../types/goal.types';
import { ConnectInvestorSaveLeadRequestProjectedReturns } from '@bambu/api-client';

export type ProjectedReturns = ConnectInvestorSaveLeadRequestProjectedReturns;

export interface GoalState {
  goalType: GoalType | null;
  goalName: string | null;
  goalValue: number | null; // goal target
  goalTimeframe: number | null;
  initialInvestment: number | null;
  monthlyContribution: number | null;
  recommendedMonthlyContribution: number | null;
  projectedReturns: ProjectedReturns;
}

export interface GoalAction {
  updateGoalData: (goal: Partial<GoalState>) => void;
  updateProjectedReturnData: (projection: Partial<ProjectedReturns>) => void;
}

export interface GoalSlice {
  goal: GoalState & GoalAction;
}

const initialState: GoalState = {
  goalType: null,
  goalName: null,
  goalValue: null,
  goalTimeframe: null,
  initialInvestment: null, // move this to goal setting
  monthlyContribution: null, // move this to goal setting
  recommendedMonthlyContribution: null, // move this to goal setting
  projectedReturns: {
    high: 0,
    low: 0,
    target: 0,
  },
};

export const goalSlice: CoreStoreStateCreator<GoalSlice> = (set) => ({
  goal: {
    ...initialState,
    updateGoalData: (newGoalData) =>
      set((state) => ({ goal: { ...state.goal, ...newGoalData } })),
    updateProjectedReturnData: (newProjectionData) =>
      set((state) => ({
        goal: {
          ...state.goal,
          projectedReturns: {
            ...state.goal.projectedReturns,
            ...newProjectionData,
          },
        },
      })),
  },
});

export default goalSlice;
