import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

export type ReactRouterWrapperProps = {
  routes: RouteObject[];
  opts?: Parameters<typeof createMemoryRouter>[1];
};

const defaultRoutes = [{ path: '/', element: 'div' }];
export const reactRouterWrapper = ({
  routes = [],
  opts,
}: ReactRouterWrapperProps) => {
  const router = createMemoryRouter([...defaultRoutes, ...routes], opts);
  return <RouterProvider router={router} />;
};

export default reactRouterWrapper;
