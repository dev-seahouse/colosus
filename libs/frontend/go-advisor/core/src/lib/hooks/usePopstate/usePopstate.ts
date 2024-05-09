import React, { useSyncExternalStore } from 'react';

export function usePopstate() {
  const isClickedRef = React.useRef(false);

  return useSyncExternalStore(subscribe, getSnapshot);

  function getSnapshot() {
    return isClickedRef.current;
  }

  function subscribe(callback: any) {
    const onPopstate = () => {
      isClickedRef.current = true;
      callback();
    };

    const offPopstate = () => {
      isClickedRef.current = false;
    };
    window.addEventListener('popstate', onPopstate);
    return () => window.removeEventListener('popstate', offPopstate);
  }
}

export default usePopstate;
