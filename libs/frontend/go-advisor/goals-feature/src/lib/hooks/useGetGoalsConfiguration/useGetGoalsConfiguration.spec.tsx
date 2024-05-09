import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import useGetGoalsConfiguration from './useGetGoalsConfiguration';

describe('useGetGoalsConfiguration', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetGoalsConfiguration(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
