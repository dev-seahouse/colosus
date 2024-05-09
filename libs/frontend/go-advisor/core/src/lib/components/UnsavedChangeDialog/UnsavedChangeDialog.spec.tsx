import UnsavedChangeDialog from './UnsavedChangeDialog';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';

describe('UnsavedChangeDialog', () => {
  // test that react-router-prompt is compatible with react-router-dom version
  it('renders successfully', () => {
    const router = createBrowserRouter([
      {
        path: '/',
        element: <UnsavedChangeDialog when={true} />,
      },
    ]);

    render(<RouterProvider router={router} />);
  });
});
