import useCreateBankAccount from './useCreateBankAccount';
import {
  act,
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';
import { createBankAccMockReq } from '@bambu/api-client';

describe('useCreateBankAccount', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useCreateBankAccount({}), {
      wrapper: queryClientWrapper,
    });
    act(() => result.current.mutate(createBankAccMockReq));
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toMatchSnapshot();
  });
});
