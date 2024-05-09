import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import useGetGoalsForTenantInvestor from './useGetGoalsForTenantInvestor';

describe('useGetGoalsForTenantInvestor', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useGetGoalsForTenantInvestor({
          pageSize: 0,
          pageIndex: 1,
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
  });
});
