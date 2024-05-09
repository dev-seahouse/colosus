import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import merge from 'lodash/merge';

import type { UserSlice } from './slices/userSlice';
import { userSlice } from './slices/userSlice';

export type UseCoreStore = UserSlice;

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
        ...userSlice(...a),
      }),
      {
        name: `${window.location.host}:go-advisor-core-storage`,
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
      name: 'GO Advisor Core Store',
    }
  )
);

export default useCoreStore;
