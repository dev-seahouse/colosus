import { act, renderHook } from '@bambu/react-test-utils';

import useSelectGoal from './useSelectGoal';

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

describe('useSelectGoal', () => {
  it('should call navigate function', () => {
    const { result } = renderHook(() => useSelectGoal());

    act(() => {
      result.current('Retirement');
    });

    expect(mockNavigate).toHaveBeenCalled();
  });
});
