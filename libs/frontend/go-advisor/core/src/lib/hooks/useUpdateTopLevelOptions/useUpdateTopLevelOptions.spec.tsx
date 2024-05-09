import {
  queryClientWrapper,
  renderHook,
  act,
  waitFor,
} from '@bambu/react-test-utils';

import useUpdateTopLevelOptions from './useUpdateTopLevelOptions';

describe('useUpdateTopLevelOptions', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useUpdateTopLevelOptions(), {
      wrapper: queryClientWrapper,
    });

    act(() => {
      result.current.mutate({
        incomeThreshold: 10000,
        retireeSavingsThreshold: 10000,
      });
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.status).toEqual('success');
  });
});
