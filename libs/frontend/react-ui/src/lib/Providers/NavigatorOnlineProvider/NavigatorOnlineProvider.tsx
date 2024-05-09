import type { ReactNode } from 'react';
import useNavigatorOnline from '../../hooks/useNavigatorOnline/useNavigatorOnline';
import NoInternetConnectionMessage from './NoInternetConnectionMessage';

export interface NavigatorOnlineProviderProps {
  children?: ReactNode;
}

/**
 * @description This component is used to show a temporary message when the user is offline.
 */
export function NavigatorOnlineProvider({
  children = null,
}: NavigatorOnlineProviderProps) {
  const isOnline = useNavigatorOnline();

  if (!isOnline) {
    return <NoInternetConnectionMessage />;
  }

  return <>{children}</>;
}

export default NavigatorOnlineProvider;
