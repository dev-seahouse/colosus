import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import merge from 'lodash/merge';
import type { StateCreator } from 'zustand';
import type { GrowMyWealthSlice } from './slices/growMyWealthSlice';
import growMyWealthSlice from './slices/growMyWealthSlice';
import type { RetirementSlice } from './slices/retirementSlice';
import retirementSlice from './slices/retirementSlice';
import type { EducationSlice } from './slices/educationSlice';
import educationSlice from './slices/educationSlice';
import type { OtherSlice } from './slices/otherSlice';
import otherSlice from './slices/otherSlice';
import type { HouseSlice } from './slices/houseSlice';
import houseSlice from './slices/houseSlice';

export type UseGoalSettingsStore = GrowMyWealthSlice &
  RetirementSlice &
  EducationSlice &
  OtherSlice &
  HouseSlice;

export type GoalSettingsStoreStateCreator<T> = StateCreator<
  UseGoalSettingsStore,
  [['zustand/devtools', never]],
  [],
  T
>;

export const useGoalSettingsStore = create<UseGoalSettingsStore>()(
  devtools(
    persist(
      (...a) => ({
        ...growMyWealthSlice(...a),
        ...retirementSlice(...a),
        ...educationSlice(...a),
        ...otherSlice(...a),
        ...houseSlice(...a),
      }),
      {
        name: `${window.location.host}:go-goal-settings-storage`,
        storage: createJSONStorage(() => sessionStorage),
        merge: (persistedState, currentState) =>
          merge(currentState, persistedState),
      }
    ),
    {
      name: 'GO Goal Settings Store',
    }
  )
);

export default useGoalSettingsStore;
