import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useResetPassword from './useResetPassword';

describe('useResetPassword', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(() => useResetPassword(), {
      wrapper: queryClientWrapper,
    });

    act(() =>
      result.current.mutate({
        username: 'matius@bambu.co',
        otp: '123456',
        newPassword: 'Bambu@1234',
      })
    );

    await waitFor(() => result.current.isSuccess);
  });
});
