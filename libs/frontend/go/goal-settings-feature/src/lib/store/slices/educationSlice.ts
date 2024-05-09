import type { GoalSettingsStoreStateCreator } from '../useGoalSettingsStore';

export interface EducationState {
  goalName: string;
  collegeFees: number | null;
  collegeStartYear: number | null;
}

export interface EducationAction {
  updateEducationData: (goal: Partial<EducationState>) => void;
}

export interface EducationSlice {
  education: EducationState & EducationAction;
}

export const educationSlice: GoalSettingsStoreStateCreator<EducationSlice> = (
  set
) => ({
  education: {
    goalName: 'Save for college fees',
    collegeFees: null,
    collegeStartYear: null,
    updateEducationData: (goal) =>
      set((state) => ({ education: { ...state.education, ...goal } })),
  },
});

export default educationSlice;
