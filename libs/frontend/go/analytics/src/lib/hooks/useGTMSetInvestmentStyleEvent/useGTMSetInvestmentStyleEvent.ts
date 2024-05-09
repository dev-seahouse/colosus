import { useCallback } from 'react';
import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook';

export interface GTMSetInvestmentStyleProps {
  value: string;
}

export function useGTMSetInvestmentStyleEvent() {
  const sendToGTM = useGTMDispatch();
  const sendGTMSetInvestmentStyleEvent = useCallback(
    ({ value }: GTMSetInvestmentStyleProps) =>
      sendToGTM({
        event: 'investment_style_set',
        value,
      }),
    [sendToGTM]
  );

  return sendGTMSetInvestmentStyleEvent;
}

export default useGTMSetInvestmentStyleEvent;
