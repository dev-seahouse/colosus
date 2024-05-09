import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';
import useGetPreferences from './useGetPreferences';

describe('useGetPreferences', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetPreferences(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
