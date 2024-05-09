import type { GoalSettingsStoreStateCreator } from '../useGoalSettingsStore';

export interface GrowMyWealthState {
  goalName: string;
  goalYear: number | null;
}

export interface GrowMyWealthAction {
  updateGrowMyWealthData: (goal: Partial<GrowMyWealthState>) => void;
}

export interface GrowMyWealthSlice {
  growMyWealth: GrowMyWealthState & GrowMyWealthAction;
}

export const growMyWealthSlice: GoalSettingsStoreStateCreator<
  GrowMyWealthSlice
> = (set) => ({
  growMyWealth: {
    goalName: 'Just want to grow my wealth',
    goalYear: null,
    updateGrowMyWealthData: (goal) =>
      set((state) => ({ growMyWealth: { ...state.growMyWealth, ...goal } })),
  },
});

export default growMyWealthSlice;
