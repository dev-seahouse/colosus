import useCreateDirectDebitMandate from './useCreateDirectDebitMandate';
import {
  act,
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import { createDirectDebitMandateMockReq } from '@bambu/api-client';

describe('useCreateDirectDebitMandate', () => {
  const mockOnSuccess = vi.fn();

  afterAll(() => {
    vi.resetAllMocks();
  });

  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useCreateDirectDebitMandate({
          onSuccess: mockOnSuccess,
        }),
      {
        wrapper: queryClientWrapper,
      }
    );
    act(() => result.current.mutate(createDirectDebitMandateMockReq));
    await waitFor(() => result.current.isSuccess);
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(result.current.data).toMatchSnapshot();
  });
});
