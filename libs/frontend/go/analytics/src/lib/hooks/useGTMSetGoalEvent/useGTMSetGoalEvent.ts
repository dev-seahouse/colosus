import { useCallback } from 'react';
import { useGTMDispatch } from '@elgorditosalsero/react-gtm-hook';

export interface GTMSetGoalProps {
  value: string;
}

export function useGTMSetGoalEvent() {
  const sendToGTM = useGTMDispatch();
  const sendGTMSetGoalEvent = useCallback(
    ({ value }: GTMSetGoalProps) =>
      sendToGTM({
        event: 'goal_set',
        value,
      }),
    [sendToGTM]
  );

  return sendGTMSetGoalEvent;
}

export default useGTMSetGoalEvent;
