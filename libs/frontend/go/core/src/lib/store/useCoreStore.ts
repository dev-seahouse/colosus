import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import merge from 'lodash/merge';
import type { LayoutSlice } from './slices/layoutSlice';
import { layoutSlice } from './slices/layoutSlice';

import type { UserSlice } from './slices/userSlice';
import { userSlice } from './slices/userSlice';
import type { GoalSlice } from './slices/goalSlice';
import goalSlice from './slices/goalSlice';

export type UseCoreStore = LayoutSlice & UserSlice & GoalSlice;

export type CoreStoreStateCreator<T> = StateCreator<
  UseCoreStore,
  [['zustand/devtools', never]],
  [],
  T
>;

export const useCoreStore = create<UseCoreStore>()(
  devtools(
    persist(
      (...a) => ({
        ...layoutSlice(...a),
        ...userSlice(...a),
        ...goalSlice(...a),
      }),
      {
        name: `${window.location.host}:go-core-storage`,
        storage: createJSONStorage(() => sessionStorage),
        // persist all data but layout
        partialize: (state) => {
          return Object.fromEntries(
            Object.entries(state).filter(([key]) => !['layout'].includes(key))
          );
        },
        merge: (persistedState, currentState) =>
          merge(currentState, persistedState),
      }
    ),
    {
      name: 'GO Core Store',
    }
  )
);

export default useCoreStore;
