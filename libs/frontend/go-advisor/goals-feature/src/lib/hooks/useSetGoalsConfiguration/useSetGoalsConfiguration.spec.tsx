import useSetGoalsConfiguration from './useSetGoalsConfiguration';
import {
  queryClientWrapper,
  renderHook,
  act,
  waitFor,
} from '@bambu/react-test-utils';

describe('useSetGoalsConfiguration', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useSetGoalsConfiguration(), {
      wrapper: queryClientWrapper,
    });

    act(() => {
      result.current.mutate(['8d299530-c622-47cb-b425-82429d7443c0']);
    });

    await waitFor(() => result.current.isSuccess);
  });
});
