import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetConnectPortfolios from './useGetConnectPortfolios';

describe('useGetConnectPortfolios', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetConnectPortfolios(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
