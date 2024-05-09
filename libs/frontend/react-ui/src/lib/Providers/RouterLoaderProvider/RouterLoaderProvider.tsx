import { useLoaderData, Await } from 'react-router-dom';
import { Suspense, cloneElement } from 'react';
import type { SuspenseProps, ReactElement } from 'react';
import type { AwaitProps } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import SuspenseFallback from '../../SuspenseFallback/SuspenseFallback';

export interface RouterLoaderProviderProps
  extends Pick<AwaitProps, 'errorElement'>,
    Pick<SuspenseProps, 'fallback'> {
  children: ReactElement;
}

/**
 * TODO: remove all RouterLoaderProvider usage
 * @deprecated do not use this as data is
 * an object with promises that must be unwrapped with 'resolve' individually,
 * unwrapping 'data' itself does will not unwrap the individual promises
 * contained within 'data', e.g. data.user will still be an unwrapped promise
 * @see {@link https://reactrouter.com/en/main/components/await} for example:
 * const { book, reviews } = useLoaderData();
 */
export function RouterLoaderProvider({
  children,
  errorElement = <Typography>Something went wrong!</Typography>,
  fallback = <SuspenseFallback />,
}: RouterLoaderProviderProps) {
  const initialData = useLoaderData();

  return (
    <Suspense fallback={fallback}>
      <Await resolve={initialData} errorElement={errorElement}>
        {(data) => {
          return cloneElement(children, { initialData: data });
        }}
      </Await>
    </Suspense>
  );
}

export default RouterLoaderProvider;
