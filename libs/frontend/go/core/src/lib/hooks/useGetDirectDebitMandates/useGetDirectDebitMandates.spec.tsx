import useGetDirectDebitMandates from './useGetDirectDebitMandates';
import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useGetDirectDebitMandate', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetDirectDebitMandates(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchSnapshot();
  });
});
