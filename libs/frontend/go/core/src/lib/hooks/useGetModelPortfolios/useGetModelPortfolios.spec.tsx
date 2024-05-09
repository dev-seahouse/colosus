import {
  renderHook,
  waitFor,
  queryClientWrapper,
} from '@bambu/react-test-utils';

import useGetModelPortfolios from './useGetModelPortfolios';

describe('useGetModelPortfolios', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetModelPortfolios(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
