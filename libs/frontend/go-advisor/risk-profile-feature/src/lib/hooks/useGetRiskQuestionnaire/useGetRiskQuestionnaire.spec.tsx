import {
  renderHook,
  waitFor,
  queryClientWrapper,
} from '@bambu/react-test-utils';
import useGetRiskQuestionnaire from './useGetRiskQuestionnaire';

describe('useGetRiskQuestionnaire', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetRiskQuestionnaire(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => result.current.isSuccess);
  });
});
