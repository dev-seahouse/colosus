import useUseGetNextPossiblePaymentDate from './useUseGetNextPossiblePaymentDate';
import {
  queryClientWrapper,
  renderHook,
  waitFor,
} from '@bambu/react-test-utils';

describe('useUseGetNextPossiblePaymentDate', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () => useUseGetNextPossiblePaymentDate({ mandateId: 'dfdfd' }),
      {
        wrapper: queryClientWrapper,
      }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchSnapshot();
  });
});
