import {
  renderHook,
  waitFor,
  queryClientWrapper,
} from '@bambu/react-test-utils';

import useGetRiskProfiles from './useGetRiskProfiles';

describe('useGetRiskProfiles', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetRiskProfiles(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => result.current.isSuccess);
  });
});
