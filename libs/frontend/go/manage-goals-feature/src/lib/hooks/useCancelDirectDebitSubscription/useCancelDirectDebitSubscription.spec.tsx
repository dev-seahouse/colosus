import {
  act,
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import useCancelDirectDebitSubscription from './useCancelDirectDebitSubscription';

describe('useCancelDirectDebitSubscription', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useCancelDirectDebitSubscription(), {
      wrapper: queryClientWrapper,
    });

    act(() => {
      result.current.mutate({
        subscriptionId: 'subscriptionId',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
