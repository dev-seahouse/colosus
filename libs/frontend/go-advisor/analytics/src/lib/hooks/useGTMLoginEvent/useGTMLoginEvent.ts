import { useCallback } from 'react';
import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook';

export interface GTMLoginEventProps {
  userId: string;
  method?: string;
}

export function useGTMLoginEvent() {
  const sendToGTM = useGTMDispatch();
  const sendGTMLoginEvent = useCallback(
    ({ userId, method = 'email' }: GTMLoginEventProps) =>
      sendToGTM({
        event: 'login',
        method,
        userId,
      }),
    [sendToGTM]
  );

  return sendGTMLoginEvent;
}

export default useGTMLoginEvent;
