import { renderHook, waitFor } from '@testing-library/react';

import useGetInvestorGoalDetails from './useGetInvestorGoalDetails';
import { queryClientWrapper } from '@bambu/react-test-utils';

describe('useGetInvestorGoalDetails', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(
      () => useGetInvestorGoalDetails({ goalId: 'dfdfd' }),
      { wrapper: queryClientWrapper }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchSnapshot();
  });
});
