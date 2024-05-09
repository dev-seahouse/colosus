import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetSubscriptions from './useGetSubscriptions';

describe('useGetPrices', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetSubscriptions(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
