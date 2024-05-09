import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import useGetLeads from './useGetLeads';

describe('useGetLeads', () => {
  it('should return leads data', async () => {
    const { result } = renderHook(
      () =>
        useGetLeads({
          pageIndex: 0,
          pageSize: 10,
          nameFilter: '',
          qualifiedFilter: 'ALL',
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    await waitFor(() => result.current.isSuccess);
  });
});
