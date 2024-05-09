import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useProfileDetails from './useProfileDetails';

describe('useProfileDetails', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useProfileDetails(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
