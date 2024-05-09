import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetTopLevelOptions from './useGetTopLevelOptions';

describe('useGetTopLevelOptions', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetTopLevelOptions(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
