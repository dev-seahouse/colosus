import { useState, useRef, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseCountDownTimerProps {
  // duration in seconds
  duration: number;
  onTimeUp?: () => void;
}

export function useCountDownTimer({
  duration = 30,
  onTimeUp,
}: UseCountDownTimerProps) {
  const durationInMs = duration * 1000;
  const [isStarted, setIsStarted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const [countDownTime, setCountDownTime] = useState(durationInMs);

  useEffect(() => {
    if (!isStarted) return;

    // skip because ref value is null during initial render
    if (endTimeRef.current == null) return;

    if (countDownTime <= 0) {
      setIsStarted(false);
      typeof onTimeUp === 'function' && onTimeUp();
      return () => {
        endTimeRef.current = null;
        clearInterval(intervalRef.current);
      };
    }

    intervalRef.current = setInterval(() => {
      if (endTimeRef.current == null) throw new Error('Impossible Error.');
      setCountDownTime(endTimeRef.current - new Date().getTime());
    }, 1000);

    // clean up
    return () => clearInterval(intervalRef.current);
  }, [countDownTime, onTimeUp, isStarted]);

  function reset() {
    setCountDownTime(durationInMs);
    startTimeRef.current = new Date().getTime();
    endTimeRef.current = startTimeRef.current + durationInMs;
  }

  return {
    countDownTime: Math.max(0, Math.round(countDownTime / 1000)),
    stop: () => {
      reset();
      clearInterval(intervalRef.current);
    },
    hasStarted: isStarted,
    start: () => {
      reset();
      setIsStarted(true);
    },
  };
}

export default useCountDownTimer;
