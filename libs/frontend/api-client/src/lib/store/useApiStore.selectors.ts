import useApiStore from './useApiStore';
import checkAccessTokenExpiry from '../utils/checkAccessTokenExpiry/checkAccessTokenExpiry';

/**
 * returns a function to set access token in API Store (hook)
 */
export const useSelectSetApiCredentials = () => {
  return useApiStore((state) => state.setApiCredentials);
};

/**
 * returns access token (non-hook)
 */
export const selectAccessToken = () => {
  return useApiStore.getState().accessToken;
};

/**
 * returns refresh token (non-hook)
 */
export const selectRefreshToken = () => {
  return useApiStore.getState().refreshToken;
};

/**
 * returns true if refresh token is expired (non-hook)
 */
export const selectIsRefreshTokenExpired = () => {
  const { refreshTokenExpiresAt } = useApiStore.getState();

  return checkAccessTokenExpiry(refreshTokenExpiresAt as string);
};

/**
 * returns true if access token is expired (non-hook)
 */
export const selectIsAccessTokenExpired = () => {
  const { accessTokenExpiresAt } = useApiStore.getState();

  return checkAccessTokenExpiry(accessTokenExpiresAt as string);
};

/**
 * returns a function to set refresh token in API state (hook)
 */
export const useSelectSetRefreshToken = () => {
  return useApiStore((state) => state.setRefreshToken);
};

/**
 * returns a function to reset API state (hook)
 */
export const useSelectResetApiStore = () => {
  return useApiStore((state) => state.reset);
};

/**
 * returns a function to reset API state (non-hook)
 */
export const selectResetApiStore = () => {
  return useApiStore.getState().reset;
};
