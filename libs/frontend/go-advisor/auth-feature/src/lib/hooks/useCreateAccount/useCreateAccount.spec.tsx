import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';
import useCreateAccount from './useCreateAccount';

const mockOnSuccess = vi.fn();

describe('useCreateAccount', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useCreateAccount({
          onSuccess: (res) => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        username: 'admin@bambu.co',
        password: 'Bambu@1234',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
