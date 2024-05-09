import type { InternalAxiosRequestConfig } from 'axios';

import createDefaultAxiosInterceptorsRequestConfig from './createDefaultAxiosInterceptorsRequestConfig';
import { afterEach } from 'vitest';

const mockRefreshToken = vi.fn();
const mockRefreshApiStore = vi.fn();

vi.mock('../../store/useApiStore.selectors', () => ({
  selectAccessToken: () => 'mock_access_token',
  selectIsAccessTokenExpired: vi
    .fn()
    .mockImplementationOnce(() => true)
    .mockImplementationOnce(() => false),
  selectIsRefreshTokenExpired: vi
    .fn()
    .mockImplementationOnce(() => false)
    .mockImplementationOnce(() => false),
  selectResetApiStore: () => mockRefreshApiStore,
}));

vi.mock('../refreshToken/refreshToken', () => ({
  default: vi.fn().mockImplementationOnce(() => mockRefreshToken()),
}));

describe('createDefaultAxiosInterceptorsRequestConfig', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call refreshToken if access token is expired and refresh token is not expired', async () => {
    await createDefaultAxiosInterceptorsRequestConfig({
      headers: {
        Authorization: '',
      },
    } as InternalAxiosRequestConfig);

    expect(mockRefreshToken).toHaveBeenCalled();
  });

  it('should set bearer token in every API call', async () => {
    const config = await createDefaultAxiosInterceptorsRequestConfig({
      headers: {
        Authorization: '',
      },
    } as InternalAxiosRequestConfig);

    expect(config.headers.Authorization).toBe('Bearer mock_access_token');
  });
});
