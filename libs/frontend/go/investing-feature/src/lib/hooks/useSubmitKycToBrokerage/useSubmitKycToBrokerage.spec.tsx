import { renderHook } from '@testing-library/react';

import useSubmitKycToBrokerage from './useSubmitKycToBrokerage';
import { act, queryClientWrapper, waitFor } from '@bambu/react-test-utils';
import { submitKycToBrokerageMockRequest } from '@bambu/api-client';
describe('useSubmitKycToBrokerage', () => {
  const mockOnSuccess = vi.fn();

  afterAll(() => {
    vi.resetAllMocks();
  });
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useSubmitKycToBrokerage({
          onSuccess: (res) => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );
    act(() => result.current.mutate(submitKycToBrokerageMockRequest));
    await waitFor(() => result.current.isSuccess);
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
