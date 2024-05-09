import { RouterProvider } from 'react-router-dom';
import { useMemo } from 'react';
import createRouter from './router/createRouter';

export function App() {
  const { search } = window.location;

  const router = useMemo(() => {
    const isIframe = search.includes('iframe');

    // use memory router when in iframe
    return createRouter(isIframe);
  }, [search]);

  return <RouterProvider router={router} />;
}

export default App;
