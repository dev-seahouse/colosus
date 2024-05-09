import { useCallback } from 'react';
import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook';

export interface GTMShareLinkEventProps {
  url: string;
}

export function useGTMShareLinkEvent() {
  const sendToGTM = useGTMDispatch();
  const sendGTMShareLinkEvent = useCallback(
    ({ url }: GTMShareLinkEventProps) =>
      sendToGTM({
        event: 'share_client_platform',
        url,
      }),
    [sendToGTM]
  );

  return sendGTMShareLinkEvent;
}

export default useGTMShareLinkEvent;
