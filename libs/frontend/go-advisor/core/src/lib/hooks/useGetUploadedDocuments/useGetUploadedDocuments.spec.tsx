import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetUploadedDocuments from './useGetUploadedDocuments';

describe('useGetUploadedDocuments', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetUploadedDocuments(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
