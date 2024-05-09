import {
  renderHook,
  waitFor,
  queryClientWrapper,
  act,
} from '@bambu/react-test-utils';

import useCreateBillingPortalSession from './useCreateBillingPortalSession';

const mockOnSuccess = vi.fn();

describe('useCreateBillingPortalSession', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useCreateBillingPortalSession({
          onSuccess: () => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() => result.current.mutate());

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
