import type { AuthStoreStateCreator } from '../useProfileCreationStore';

export interface OnboardingLayoutState {
  progress: number;
  showBackButton: boolean;
}

export interface OnboardingLayoutAction {
  setProgress: (progress: number) => void;
  setShowBackButton: (showBackButton: boolean) => void;
  resetLayoutState: () => void;
}

export interface OnboardingLayoutSlice {
  layout: OnboardingLayoutState & OnboardingLayoutAction;
}

const initialState = {
  progress: 25,
  showBackButton: false,
};

export const createOnboardingLayoutSlice: AuthStoreStateCreator<
  OnboardingLayoutSlice
> = (set) => ({
  layout: {
    ...initialState,
    setProgress: (progress) =>
      set((state) => ({ layout: { ...state.layout, progress } })),
    setShowBackButton: (showBackButton) =>
      set((state) => ({ layout: { ...state.layout, showBackButton } })),
    resetLayoutState: () =>
      set((state) => ({ layout: { ...state.layout, ...initialState } })),
  },
});

export default createOnboardingLayoutSlice;
