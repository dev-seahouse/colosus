import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useLogin from './useLogin';

const mockOnSuccess = vi.fn();

describe('useLogin', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useLogin({
          onSuccess: (res) => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        username: 'matius@bambu.co',
        password: 'Bambu@123',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
