import useMediaQuery from '@mui/material/useMediaQuery';
import type { Theme } from '@mui/material/styles';

/**
 * deprecated, use real media query or sx props instead
 * the reason is because:
 * 1. Mobile-first, so we should use min-width instead of max-width
 * 2. useMediaQuery causes re-render
 */
export function useMobileView() {
  return useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
}

export default useMobileView;
