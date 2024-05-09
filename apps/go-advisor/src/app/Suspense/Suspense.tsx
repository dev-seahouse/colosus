import { Suspense as ReactSuspense } from 'react';
import { SuspenseFallback } from '@bambu/react-ui';

import type { SuspenseProps as ReactSuspenseProps } from 'react';

export type SuspenseProps = ReactSuspenseProps;

/**
 * default react suspense for go-advisor
 */
export const Suspense = ({
  children,
  fallback = <SuspenseFallback />,
  ...rest
}: SuspenseProps) => {
  return (
    <ReactSuspense {...rest} fallback={fallback}>
      {children}
    </ReactSuspense>
  );
};

export default Suspense;
