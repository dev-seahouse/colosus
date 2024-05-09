/* eslint-disable */
import {
  renderHook,
  waitFor,
  queryClientWrapper,
  act,
} from '@bambu/react-test-utils';

import useCreateCheckoutSession from './useCreateCheckoutSession';

const mockOnSuccess = vi.fn();

describe('useCreateCheckoutSession', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useCreateCheckoutSession({
          onSuccess: () => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        priceId: 'price_1J9Z',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
