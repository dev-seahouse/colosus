import useUpdateAdvisorBankAccount from './useUpdateAdvisorBankAccount';
import {
  queryClientWrapper,
  renderHook,
  act,
  waitFor,
} from '@bambu/react-test-utils';

describe('useUpdateAdvisorBankAccount', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useUpdateAdvisorBankAccount(), {
      wrapper: queryClientWrapper,
    });

    act(() => {
      result.current.mutate({
        accountName: 'Wealth Avenue LLC',
        accountNumber: '12345678',
        sortCode: '123456',
        annualManagementFee: '5',
      });
    });

    await waitFor(() => result.current.isSuccess);
  });
});
