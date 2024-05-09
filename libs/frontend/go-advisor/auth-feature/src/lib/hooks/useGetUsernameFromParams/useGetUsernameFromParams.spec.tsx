import { renderHook, reactRouterWrapper } from '@bambu/react-test-utils';

import useGetUsernameFromParams from './useGetUsernameFromParams';

describe('useGetUsernameFromParams', () => {
  it('should retrieve username from params', () => {
    const { result } = renderHook(() => useGetUsernameFromParams(), {
      wrapper: (props) =>
        reactRouterWrapper({
          routes: [{ path: '/test', element: props.children }],
          opts: {
            initialEntries: ['/test?username=matius@bambu.co'],
            initialIndex: 1,
          },
        }),
    });

    expect(result.current).toBe('matius@bambu.co');
  });
});
