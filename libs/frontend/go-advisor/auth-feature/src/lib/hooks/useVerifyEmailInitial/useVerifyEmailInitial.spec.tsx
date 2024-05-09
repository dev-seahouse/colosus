import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useVerifyEmailInitial from './useVerifyEmailInitial';

describe('useVerifyEmailInitial', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useVerifyEmailInitial({}), {
      wrapper: queryClientWrapper,
    });

    act(() =>
      result.current.mutate({
        username: 'admin@bambu.co',
        otp: '123456',
      })
    );

    await waitFor(() => result.current.isSuccess);
  });
});
