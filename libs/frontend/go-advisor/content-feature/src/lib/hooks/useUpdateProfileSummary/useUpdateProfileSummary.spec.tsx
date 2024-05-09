import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useUpdateProfileSummary from './useUpdateProfileSummary';

const mockOnSuccess = vi.fn();

describe('useUpdateProfileSummary', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(
      () =>
        useUpdateProfileSummary({
          onSuccess: () => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        richText: '<p>Test</p>',
        fullProfileLink: '',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
