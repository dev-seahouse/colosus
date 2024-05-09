import useGetDirectDebitSubscriptions from './useGetDirectDebitSubscriptions';
import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useGetDirectDebitSubscriptions', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useGetDirectDebitSubscriptions({
          limit: 10,
        }),
      {
        wrapper: queryClientWrapper,
      }
    );
    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy();
    });
  });
});
