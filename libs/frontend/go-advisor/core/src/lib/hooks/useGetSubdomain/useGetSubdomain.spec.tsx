import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetSubdomain from './useGetSubdomain';

describe('useGetTenantBranding', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetSubdomain(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
