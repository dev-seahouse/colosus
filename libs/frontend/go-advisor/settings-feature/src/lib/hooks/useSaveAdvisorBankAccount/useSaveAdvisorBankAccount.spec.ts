import useSaveAdvisorBankAccount from './useSaveAdvisorBankAccount';
import {
  queryClientWrapper,
  renderHook,
  act,
  waitFor,
} from '@bambu/react-test-utils';

describe('useSaveAdvisorBankAccount', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useSaveAdvisorBankAccount(), {
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
