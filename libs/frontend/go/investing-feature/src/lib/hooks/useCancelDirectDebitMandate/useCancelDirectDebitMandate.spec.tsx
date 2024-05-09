import useCancelDirectDebitMandate from './useCancelDirectDebitMandate';
import {
  act,
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useCancelDirectDebitMandate', () => {
  const mockOnSuccess = vi.fn();
  afterAll(() => {
    vi.resetAllMocks();
  });
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useCancelDirectDebitMandate({
          onSuccess: mockOnSuccess,
        }),
      {
        wrapper: queryClientWrapper,
      }
    );
    act(() => result.current.mutate({ mandateId: '123' }));
    await waitFor(() => result.current.isSuccess);
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.data).toMatchSnapshot();
  });
});
