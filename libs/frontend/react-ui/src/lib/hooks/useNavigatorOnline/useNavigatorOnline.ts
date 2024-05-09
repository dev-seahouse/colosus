import { useState, useEffect } from 'react';

const getOnLineStatus = () =>
  typeof navigator !== 'undefined' ? navigator.onLine : true;

/**
 * returns the online status of the browser
 */
export function useNavigatorOnline() {
  const [status, setStatus] = useState(getOnLineStatus());

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return status;
}

export default useNavigatorOnline;
