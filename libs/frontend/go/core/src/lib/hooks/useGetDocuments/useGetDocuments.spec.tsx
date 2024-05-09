import {
  renderHook,
  waitFor,
  queryClientWrapper,
} from '@bambu/react-test-utils';

import useGetDocuments from './useGetDocuments';

describe('useGetDocuments', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetDocuments(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
