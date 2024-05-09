import { renderHook } from '@testing-library/react';

import useGetInvestorProfile from './useGetInvestorProfile';
import { queryClientWrapper, waitFor } from '@bambu/react-test-utils';

describe('useGetInvestorProfile', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useGetInvestorProfile(), {
      wrapper: queryClientWrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // this is important for storybook to work, make sure to change the goal id of GoalDetails components to match the id of the goal in the mock data
    expect(
      result.current.data?.Goals.find(
        (goal) => goal.id === '0a9cade0-66ec-479b-b6f3-ad7c3fafb55f'
      )
    ).toBeTruthy();
    expect(result.current.data).toMatchSnapshot();
  });
});
