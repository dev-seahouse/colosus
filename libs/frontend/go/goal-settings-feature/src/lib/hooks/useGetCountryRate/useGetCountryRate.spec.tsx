import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useGetCountryRate from './useGetCountryRate';

describe('useGetCountryRate', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetCountryRate(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
