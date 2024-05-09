import type { CoreStoreStateCreator } from '../useCoreStore';

export interface LayoutState {
  progress: number;
  showBackButton: boolean;
}

export interface LayoutAction {
  setProgress: (progress: number) => void;
  setShowBackButton: (showBackButton: boolean) => void;
  resetLayoutState: () => void;
}

export interface LayoutSlice {
  layout: LayoutState & LayoutAction;
}

const initialState = {
  progress: 25,
  showBackButton: false,
};

export const layoutSlice: CoreStoreStateCreator<LayoutSlice> = (set) => ({
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

export default layoutSlice;
