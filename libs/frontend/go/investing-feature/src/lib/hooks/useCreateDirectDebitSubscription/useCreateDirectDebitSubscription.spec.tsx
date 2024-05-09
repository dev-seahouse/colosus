import { createDirectDebitSubscriptionMockReq } from '@bambu/api-client';
import useCreateDirectDebitSubscription from './useCreateDirectDebitSubscription';
import {
  act,
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useCreateDirectDebitSubscription', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useCreateDirectDebitSubscription(), {
      wrapper: queryClientWrapper,
    });

    act(() => {
      result.current.mutate(createDirectDebitSubscriptionMockReq);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
