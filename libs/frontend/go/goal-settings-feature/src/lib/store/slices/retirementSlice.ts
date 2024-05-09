import type { GoalSettingsStoreStateCreator } from '../useGoalSettingsStore';

export interface RetirementState {
  retirementAge: number | null;
  monthlyExpenses: number | null;
  goalName: string;
}

export interface RetirementAction {
  updateRetirementData: (goal: Partial<RetirementState>) => void;
}

export interface RetirementSlice {
  retirement: RetirementState & RetirementAction;
}

export const retirementSlice: GoalSettingsStoreStateCreator<RetirementSlice> = (
  set
) => ({
  retirement: {
    goalName: 'Retire comfortably',
    retirementAge: null,
    monthlyExpenses: null,
    updateRetirementData: (goal) =>
      set((state) => ({ retirement: { ...state.retirement, ...goal } })),
  },
});

export default retirementSlice;
