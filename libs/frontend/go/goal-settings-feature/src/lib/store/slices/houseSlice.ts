import type { GoalSettingsStoreStateCreator } from '../useGoalSettingsStore';

export interface HouseState {
  goalName: string;
  downPaymentPercentage: string;
  housePrice: number | null;
  purchaseYear: number | null;
}

export interface HouseAction {
  updateHouseData: (goal: Partial<HouseState>) => void;
}

export interface HouseSlice {
  house: HouseState & HouseAction;
}

export const houseSlice: GoalSettingsStoreStateCreator<HouseSlice> = (set) => ({
  house: {
    goalName: 'Buy a house',
    downPaymentPercentage: '20',
    housePrice: null,
    purchaseYear: null,
    updateHouseData: (goal) =>
      set((state) => ({ house: { ...state.house, ...goal } })),
  },
});

export default houseSlice;
