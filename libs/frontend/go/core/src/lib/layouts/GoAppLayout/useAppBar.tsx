import { LinearProgress } from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface useHeaderIndicatorProps {
  component?: React.ReactElement;
}

// TODO: automatically intercept http requests and show progress bar
export function useAppBar({
  component = <LinearProgress />,
}: useHeaderIndicatorProps = {}) {
  const ref = React.useRef<Element | null>();
  useEffect(() => {
    ref.current = document.querySelector('#app-bar');
  }, []);
  return {
    show: () => ref.current && createPortal(component, ref.current),
  };
}

export default useAppBar;
