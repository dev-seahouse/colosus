import { renderHook, waitFor } from '@testing-library/react';

import useGetBankAccountsPaged from './useGetBankAccountsPaged';
import { queryClientWrapper } from '@bambu/react-test-utils';

describe('useGetBankAccountsPaged', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () =>
        useGetBankAccountsPaged({
          limit: 10,
        }),
      {
        wrapper: queryClientWrapper,
      }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
