// @vitest-environment jsdom
// use jsdom because of FormData
import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useUploadDocument from './useUploadDocument';

const mockOnSuccess = vi.fn();

describe('useUploadDocument', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(
      () =>
        useUploadDocument({
          onSuccess: () => mockOnSuccess(),
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    act(() =>
      result.current.mutate({
        document: new FormData(),
        documentType: 'PRIVACY_POLICY',
      })
    );

    await waitFor(() => result.current.isSuccess);

    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
