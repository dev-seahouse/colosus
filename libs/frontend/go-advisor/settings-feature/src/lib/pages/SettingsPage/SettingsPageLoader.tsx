import { useLoaderData, Await } from 'react-router-dom';
import { Suspense, Children, cloneElement } from 'react';
import type { SuspenseProps, ReactElement } from 'react';
import type { AwaitProps } from 'react-router-dom';

import { Typography } from '@bambu/react-ui';
import type { GetTopLevelOptionsData } from '@bambu/go-advisor-core';

export interface RouterLoaderProviderProps
  extends Pick<AwaitProps, 'errorElement'>,
    Pick<SuspenseProps, 'fallback'> {
  children: ReactElement;
}

export function SettingsPageLoader({
  children,
  errorElement = <Typography>Something went wrong!</Typography>,
  fallback = null,
}: RouterLoaderProviderProps) {
  const data = useLoaderData() as { topLevelOptions: GetTopLevelOptionsData };

  return (
    <Suspense fallback={fallback}>
      <Await resolve={data.topLevelOptions} errorElement={errorElement}>
        {(topLevelOptions) =>
          cloneElement(Children.only(children), { topLevelOptions })
        }
      </Await>
    </Suspense>
  );
}

export default SettingsPageLoader;
