import { renderHook, waitFor } from '@testing-library/react';
import { useGetBrokerageProfileForInvestor } from './useGetBrokerageProfileForInvestor';
import { queryClientWrapper } from '@bambu/react-test-utils';

describe('useGetBrokerageProfileForInvestor', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetBrokerageProfileForInvestor(), {
      wrapper: queryClientWrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
