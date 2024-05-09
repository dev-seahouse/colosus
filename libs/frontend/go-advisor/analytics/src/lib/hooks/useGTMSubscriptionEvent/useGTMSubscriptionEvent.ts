import { useCallback } from 'react';
import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook';

export function useGTMSubscriptionEvent() {
  const sendToGTM = useGTMDispatch();
  const sendGTMSubscriptionEvent = useCallback(
    () =>
      sendToGTM({
        event: 'subscribed',
        method: 'stripe',
        currency: 'USD',
        value: 99,
      }),
    [sendToGTM]
  );

  return sendGTMSubscriptionEvent;
}

export default useGTMSubscriptionEvent;
