import { act, renderHook } from '@bambu/react-test-utils';

import useNavigateToGoalInsight from './useNavigateToGoalInsight';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...mod,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@harnessio/ff-react-client-sdk', async () => {
  const mod = await vi.importActual<
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    typeof import('@harnessio/ff-react-client-sdk')
  >('@harnessio/ff-react-client-sdk');
  return {
    ...mod,
    useFeatureFlag: vi.fn().mockReturnValue(true),
  };
});

describe('useNavigateToGoalInsight', () => {
  it('should call navigate function', () => {
    const { result } = renderHook(() => useNavigateToGoalInsight());

    act(() => {
      result.current();
    });

    expect(mockNavigate).toHaveBeenCalled();
  });
});
