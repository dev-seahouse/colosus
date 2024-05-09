import type { SuspenseProps as ReactSuspenseProps } from 'react';
import { Suspense as ReactSuspense } from 'react';
import { enqueueSnackbar, SuspenseFallback } from '@bambu/react-ui';
import {
  selectAccessToken,
  selectIsAccessTokenExpired,
} from '@bambu/api-client';
import { useNavigate } from 'react-router-dom';

export type SuspenseProps = ReactSuspenseProps;

/**
 * TODO: 1. change this to outlet
 * TODO: 2. add idle timer
 * TODO: 3. after user session expired and login again, redirect them to the previous page that they were on
 * React suspense plus auth route for investor platform
 */
export const InvestorAuthenticatedRoute = ({
  children,
  fallback = <SuspenseFallback />,
  ...rest
}: SuspenseProps) => {
  const accessToken = selectAccessToken();
  const isAccessTokenExpired = selectIsAccessTokenExpired();
  const navigate = useNavigate();

  if (isAccessTokenExpired || !accessToken) {
    enqueueSnackbar('Your session has expired. Please log in again.', {
      variant: 'info',
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
    });
    setTimeout(() => {
      navigate('/login');
    }, 300);
    return;
  }
  return (
    <ReactSuspense {...rest} fallback={fallback}>
      {children}
    </ReactSuspense>
  );
};

export default InvestorAuthenticatedRoute;
