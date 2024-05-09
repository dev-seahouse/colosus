import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import type { AccountSlice } from './slices/createAccountSlice';

import { createAccountSlice } from './slices/createAccountSlice';

export type UseAuthStore = AccountSlice;

export type AuthStoreStateCreator<T> = StateCreator<
  UseAuthStore,
  [['zustand/devtools', never]],
  [],
  T
>;

export const useAuthStore = create<UseAuthStore>()(
  devtools(
    (...a) => ({
      ...createAccountSlice(...a),
    }),
    { name: 'Auth Store' }
  )
);

export default useAuthStore;
