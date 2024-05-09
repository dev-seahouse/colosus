import { act, renderHook } from '@bambu/react-test-utils';

import useAuthStore from './useAuthStore';

describe('useAuthStore', () => {
  it('should be able to set reset password username', async () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => result.current.setResetPasswordUsername('matius@bambu.co'));

    expect(result.current.resetPassword.username).toEqual('matius@bambu.co');
  });
});
