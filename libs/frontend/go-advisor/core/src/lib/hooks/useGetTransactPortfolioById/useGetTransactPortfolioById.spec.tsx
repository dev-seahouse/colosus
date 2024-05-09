import useGetTransactPortfolioById from './useGetTransactPortfolioById';
import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useGetTransactPortfolioById', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetTransactPortfolioById('233'), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
  });
});
