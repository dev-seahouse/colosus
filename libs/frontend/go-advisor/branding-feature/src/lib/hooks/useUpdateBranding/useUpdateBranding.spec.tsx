import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useUpdateBranding from './useUpdateBranding';

const mockOnSuccess = vi.fn();

describe('useUpdateBranding', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(
      () =>
        useUpdateBranding({
          onSuccess: () => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        brandColor: '#000000',
        headerBgColor: '#000000',
        tradeName: 'Test',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
