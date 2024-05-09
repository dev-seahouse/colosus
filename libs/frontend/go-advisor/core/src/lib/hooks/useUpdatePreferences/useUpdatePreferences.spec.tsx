import {
  queryClientWrapper,
  renderHook,
  act,
  waitFor,
} from '@bambu/react-test-utils';

import useUpdatePreferences from './useUpdatePreferences';

describe('useUpdatePreferences', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useUpdatePreferences(), {
      wrapper: queryClientWrapper,
    });

    act(() => {
      result.current.mutate({
        minimumAnnualIncomeThreshold: 111111,
        minimumRetirementSavingsThreshold: 211111,
      });
    });

    await waitFor(() => result.current.isSuccess);
  });
});
