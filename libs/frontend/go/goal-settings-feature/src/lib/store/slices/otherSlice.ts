import type { GoalSettingsStoreStateCreator } from '../useGoalSettingsStore';

export interface OtherState {
  goalName: string;
  goalValue: number | null;
  goalYear: number | null;
}

export interface OtherAction {
  updateOtherData: (goal: Partial<OtherState>) => void;
}

export interface OtherSlice {
  other: OtherState & OtherAction;
}

export const otherSlice: GoalSettingsStoreStateCreator<OtherSlice> = (set) => ({
  other: {
    goalName: 'I have another goal in mind',
    goalValue: null,
    goalYear: null,
    updateOtherData: (goal) =>
      set((state) => ({ other: { ...state.other, ...goal } })),
  },
});

export default otherSlice;
