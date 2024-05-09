import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import useGetInvestorRiskProfiles from './useGetInvestorRiskProfiles';

describe('useGetInvestorRiskProfiles', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetInvestorRiskProfiles(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchSnapshot();
  });
});
