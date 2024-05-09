import useCreateWithdrawalRequest from './useCreateWithdrawalRequest';
import {
  act,
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import { InvestorBrokerageIntegrationWithdrawalTypeEnum } from '@bambu/api-client';

describe('useCreateWithdrawalRequest', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useCreateWithdrawalRequest(), {
      wrapper: queryClientWrapper,
    });

    act(() => {
      result.current.mutate({
        bankAccountId: 'string',
        consideration: {
          currency: 'GBP',
          amount: 1.14,
        },
        reference: '9394967',
        type: InvestorBrokerageIntegrationWithdrawalTypeEnum.SpecifiedAmount,
        closePortfolio: false,
        goalId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBeTruthy();
    });
  });
});
