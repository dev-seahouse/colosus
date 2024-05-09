import { type ReactElement, type ReactNode } from 'react';
import { render } from '@testing-library/react';
import {
  ThemeProvider,
  createBambuTheme,
  SnackbarProvider,
} from '@bambu/react-ui';
import type { RouteObject } from 'react-router-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react';
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook';

const theme = createBambuTheme();

export interface AllTheProvidersProps {
  children?: ReactNode;
  routes?: RouteObject[];
  queryClient?: QueryClient;
}

const AllTheProviders = ({
  queryClient = new QueryClient(),
  children,
  routes = [],
}: AllTheProvidersProps) => {
  const currentRoute = { element: children, path: '/' };
  const router = createMemoryRouter([{ ...currentRoute, ...routes }], {
    initialEntries: [currentRoute.path],
    initialIndex: 1,
  });

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GTMProvider>
          <RouterProvider router={router} />
        </GTMProvider>
        <SnackbarProvider />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  path?: string;
}

export const renderWithDataRouter = (
  ui: ReactElement,
  options?: CustomRenderOptions
) =>
  render(ui, {
    wrapper: (props) => (
      <AllTheProviders queryClient={options?.queryClient} {...props} />
    ),
    ...options,
  });

export default renderWithDataRouter;
