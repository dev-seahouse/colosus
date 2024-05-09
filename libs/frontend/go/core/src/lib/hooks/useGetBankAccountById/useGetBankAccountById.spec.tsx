import useGetBankAccountById from './useGetBankAccountById';
import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useGetBankAccountById', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () => useGetBankAccountById({ bankAccountId: '1' }),
      { wrapper: queryClientWrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
