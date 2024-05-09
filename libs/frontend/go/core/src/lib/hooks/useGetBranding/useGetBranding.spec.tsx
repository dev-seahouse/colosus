import {
  renderHook,
  waitFor,
  queryClientWrapper,
} from '@bambu/react-test-utils';

import useGetBranding from './useGetBranding';

describe('useGetBranding', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetBranding(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
