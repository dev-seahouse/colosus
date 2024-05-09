import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useVerifyEmailInitial from './useVerifyAccount';

const mockOnSuccess = vi.fn();

describe('useVerifyAccount', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useVerifyEmailInitial({
          onSuccess: (res) => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        username: 'admin@bambu.co',
        otp: '123456',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
