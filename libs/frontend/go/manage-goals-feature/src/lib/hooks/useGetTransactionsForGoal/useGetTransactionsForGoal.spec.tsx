import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import useGetTransactionsForGoal from './useGetTransactionsForGoal';

describe('useGetTransactionsForGoal', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useGetTransactionsForGoal({
          goalId: '1',
          limit: 90,
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
