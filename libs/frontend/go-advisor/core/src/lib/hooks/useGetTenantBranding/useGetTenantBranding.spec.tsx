import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetTenantBranding from './useGetTenantBranding';

describe('useGetTenantBranding', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetTenantBranding(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
