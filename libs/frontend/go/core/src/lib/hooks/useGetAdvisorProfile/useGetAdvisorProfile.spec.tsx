import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetAdvisorProfile from './useGetAdvisorProfile';

describe('useGetAdvisorProfile', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetAdvisorProfile(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
