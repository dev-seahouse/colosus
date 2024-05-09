import { renderHook } from '@bambu/react-test-utils';
import useLayoutDimensions from './useLayoutDimensions';

describe('useLayoutDimensions', () => {
  it('should render successfully', async () => {
    const { result } = renderHook(() => useLayoutDimensions(true));
    expect(result).toBeTruthy();
  });
});
