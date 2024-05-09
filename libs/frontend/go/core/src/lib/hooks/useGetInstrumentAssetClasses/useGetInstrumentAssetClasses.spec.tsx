import { renderHook, waitFor } from '@testing-library/react';

import useGetInstrumentAssetClasses from './useGetInstrumentAssetClasses';
import { queryClientWrapper } from '@bambu/react-test-utils';

describe('useGetInstrumentAssetClasses', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetInstrumentAssetClasses(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
