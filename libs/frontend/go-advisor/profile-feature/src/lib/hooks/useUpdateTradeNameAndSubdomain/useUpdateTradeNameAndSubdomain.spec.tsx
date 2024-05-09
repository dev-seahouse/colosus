import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useUpdateTradeNameAndSubdomain from './useUpdateTradeNameAndSubdomain';

const mockOnSuccess = vi.fn();

describe('useUpdateTradeNameAndSubdomain', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(
      () =>
        useUpdateTradeNameAndSubdomain({
          onSuccess: () => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        tradeName: 'Bambu',
        subdomain: 'bambu',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
