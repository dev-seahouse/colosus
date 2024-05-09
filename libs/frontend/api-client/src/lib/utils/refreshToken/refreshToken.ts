import { selectRefreshToken } from '../../store/useApiStore.selectors';
import AuthenticationApi from '../../Authentication/Authentication';
import useApiStore from '../../store/useApiStore';

import getTokenExpiryDate from '../getTokenExpiryDate/getTokenExpiryDate';

/**
 * Refreshes access token
 */
export const refreshToken = async () => {
  const refreshToken = selectRefreshToken() as string;
  const authApi = new AuthenticationApi();

  const res = await authApi.refreshToken({
    refresh_token: refreshToken,
  });

  useApiStore.setState({
    accessToken: res.data.access_token,
    accessTokenExpiresAt: getTokenExpiryDate(res.data.expires_in),
    refreshToken: res.data.refresh_token,
    refreshTokenExpiresAt: getTokenExpiryDate(res.data.refresh_expires_in),
  });

  return res.data.access_token;
};

export default refreshToken;
