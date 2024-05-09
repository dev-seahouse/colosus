import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useSendResetPasswordEmail from './useSendResetPasswordEmail';

const mockOnSuccess = vi.fn();

describe('useSendResetPasswordEmail', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(
      () =>
        useSendResetPasswordEmail({
          onSuccess: () => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        email: 'matius@bambu.co',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
