import useGetBankAccounts from './useGetBankAccounts';
import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useGetBankAccounts', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetBankAccounts(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchSnapshot();
  });
});
