import useCreateDirectDebitPayment from './useCreateDirectDebitPayment';
import {
  act,
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useCreateDirectDebitPayment', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useCreateDirectDebitPayment(), {
      wrapper: queryClientWrapper,
    });
    act(() =>
      result.current.mutate({
        amount: {
          amount: 1000,
          currency: 'GBP',
        },
        mandateId: 'ddm-123456789',
        goalId: 'f254692e-900a-412f-a000-155e4117c346',
        collectionDate: '2021-01-01',
      })
    );
    await waitFor(() => result.current.isSuccess);
  });
});
