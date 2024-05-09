import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

import type { AdvisorDetailsSlice } from './slices/createAdvisorDetailsSlice';
import { createAdvisorDetailsSlice } from './slices/createAdvisorDetailsSlice';
import type { OnboardingLayoutSlice } from './slices/createOnboardingLayoutSlice';
import { createOnboardingLayoutSlice } from './slices/createOnboardingLayoutSlice';

export type UseProfileCreationStore = AdvisorDetailsSlice &
  OnboardingLayoutSlice;

export type AuthStoreStateCreator<T> = StateCreator<
  UseProfileCreationStore,
  [['zustand/devtools', never]],
  [],
  T
>;

export const useProfileCreationStore = create<UseProfileCreationStore>()(
  devtools(
    (...a) => ({
      ...createAdvisorDetailsSlice(...a),
      ...createOnboardingLayoutSlice(...a),
    }),
    { name: 'Profile Creation Store' }
  )
);

export default useProfileCreationStore;
