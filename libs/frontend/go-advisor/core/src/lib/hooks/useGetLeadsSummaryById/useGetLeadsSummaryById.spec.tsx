import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import { useGetLeadsSummaryById } from './useGetLeadsSummaryById';

describe('useGetLeadsBySummaryId', () => {
  it('should return leads data by id', async () => {
    const { result } = renderHook(
      () =>
        useGetLeadsSummaryById({
          id: '',
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    await waitFor(() => result.current.isSuccess);
  });
});
