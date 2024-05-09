import type { InternalAxiosRequestConfig } from 'axios';

import {
  selectAccessToken,
  selectIsAccessTokenExpired,
  selectIsRefreshTokenExpired,
  selectResetApiStore,
} from '../../store/useApiStore.selectors';
import refreshToken from '../refreshToken/refreshToken';

/**
 * Creates default axios interceptors request config with ability to:
 * - refresh access token if it is expired
 * - set access token in Authorization header
 */
export const createDefaultAxiosInterceptorsRequestConfig = async (
  config: InternalAxiosRequestConfig
) => {
  let token = selectAccessToken();
  const isRefreshTokenExpired = selectIsRefreshTokenExpired();
  const isAccessTokenExpired = selectIsAccessTokenExpired();
  const controller = new AbortController();
  const cfg = {
    ...config,
    signal: controller.signal,
  };

  if (isAccessTokenExpired) {
    if (!isRefreshTokenExpired) {
      token = await refreshToken();
    } else {
      const reset = selectResetApiStore();
      reset();
      controller.abort('refresh token expired');
      return cfg;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export default createDefaultAxiosInterceptorsRequestConfig;
