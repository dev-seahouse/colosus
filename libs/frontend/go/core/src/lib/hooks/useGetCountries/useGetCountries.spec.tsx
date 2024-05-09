import { renderHook, waitFor } from '@testing-library/react';

import useGetCountries from './useGetCountries';
import { queryClientWrapper } from '@bambu/react-test-utils';

describe('useGetCountries', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetCountries(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
