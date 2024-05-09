import {
  act,
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import useResendOtp from './useResendOtp';
describe('useResendOtp', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useResendOtp(), {
      wrapper: queryClientWrapper,
    });

    act(() => {
      result.current.mutate({
        email: 'test@bambu.co',
      });
    });

    await waitFor(() => result.current.isSuccess);
  });
});
