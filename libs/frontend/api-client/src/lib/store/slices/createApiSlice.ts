import type { StateCreator } from 'zustand';

import { createBaseURL } from './apiSlice.utils';
import getTokenExpiryDate from '../../utils/getTokenExpiryDate/getTokenExpiryDate';

export interface ApiState {
  baseURL: string;
  originOverride: string | null;
  accessToken: string | null;
  accessTokenExpiresAt: number | string | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: number | string | null;
}

export interface ApiSlice extends ApiState {
  setApiCredentials: (
    apiState: Omit<ApiState, 'baseURL' | 'originOverride'>
  ) => void;
  setRefreshToken: (
    apiState: Pick<ApiState, 'refreshTokenExpiresAt' | 'refreshToken'>
  ) => void;
  reset(): void;
}

const apiSliceInitialState = {
  accessToken: null,
  accessTokenExpiresAt: null,
  refreshToken: null,
  refreshTokenExpiresAt: null,
};

export const createApiSlice: StateCreator<
  ApiSlice,
  [['zustand/devtools', never]],
  [],
  ApiSlice
> = (set) => ({
  baseURL: createBaseURL(),
  originOverride: null,
  ...apiSliceInitialState,
  setApiCredentials: (apiState) =>
    set(
      // The set function merges state one level, it's already immutable
      () => ({
        accessToken: apiState.accessToken,
        accessTokenExpiresAt: getTokenExpiryDate(
          apiState.accessTokenExpiresAt as number
        ),
        refreshToken: apiState.refreshToken,
        refreshTokenExpiresAt: getTokenExpiryDate(
          apiState.refreshTokenExpiresAt as number
        ),
      }),
      false,
      'setApiCredentials'
    ),
  setRefreshToken: (apiState) =>
    set(() => ({
      refreshToken: apiState.refreshToken,
      refreshTokenExpiresAt: getTokenExpiryDate(
        apiState.refreshTokenExpiresAt as number
      ),
    })),
  reset: () => set(() => ({ ...apiSliceInitialState })),
});
