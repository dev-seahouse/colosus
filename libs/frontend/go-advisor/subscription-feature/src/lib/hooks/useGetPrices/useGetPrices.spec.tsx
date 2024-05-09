import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetPrices from './useGetPrices';

describe('useGetPrices', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetPrices(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
