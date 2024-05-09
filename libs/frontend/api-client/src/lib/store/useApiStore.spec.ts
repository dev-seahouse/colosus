// @vitest-environment happy-dom
import { renderHook, act } from '@bambu/react-test-utils';
import { Settings } from 'luxon';
import useApiStore from './useApiStore';

describe('useApiStore', () => {
  it('should be able to set api credentials', () => {
    Settings.defaultZone = 'Greenwich';
    Settings.now = () => new Date(Date.UTC(2023, 0, 1, 0, 0, 0)).valueOf();

    const { result } = renderHook(() => useApiStore());

    act(() =>
      result.current.setApiCredentials({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        accessTokenExpiresAt: 300,
        refreshTokenExpiresAt: 300,
      })
    );

    expect(result.current.accessToken).toEqual('mock_access_token');
    expect(result.current.refreshToken).toEqual('mock_refresh_token');
    expect(String(result.current.accessTokenExpiresAt)).toEqual(
      '2023-01-01T00:05:00.000+00:00'
    );
    expect(String(result.current.refreshTokenExpiresAt)).toEqual(
      '2023-01-01T00:05:00.000+00:00'
    );
  });

  it('should be able to set refreshToken', () => {
    Settings.defaultZone = 'Greenwich';
    Settings.now = () => new Date(Date.UTC(2023, 0, 1, 0, 0, 0)).valueOf();

    const { result } = renderHook(() => useApiStore());

    act(() =>
      result.current.setRefreshToken({
        refreshToken: 'mock_refresh_token',
        refreshTokenExpiresAt: 300,
      })
    );

    expect(result.current.refreshToken).toEqual('mock_refresh_token');
    expect(String(result.current.refreshTokenExpiresAt)).toEqual(
      '2023-01-01T00:05:00.000+00:00'
    );
  });

  it('should be able to reset api store', () => {
    const { result } = renderHook(() => useApiStore());

    act(() =>
      result.current.setRefreshToken({
        refreshToken: 'mock_refresh_token',
        refreshTokenExpiresAt: 300,
      })
    );

    act(() => result.current.reset());

    expect(result.current.refreshToken).toEqual(null);
    expect(result.current.refreshTokenExpiresAt).toEqual(null);
  });
});
