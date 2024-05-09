import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';

import type { SnackbarProviderProps as NotistackSnackbarProviderProps } from 'notistack';
import StyledSnackbar, { StyledLongSnackbar } from './StyledSnackbar';
import SnackbarCloseButton from './SnackbarCloseButton';

declare module 'notistack' {
  interface VariantOverrides {
    long_success: true;
    long_error: true;
  }
}
export type SnackbarProviderProps = NotistackSnackbarProviderProps;

const DEFAULT_ANCHOR_ORIGIN: SnackbarProviderProps['anchorOrigin'] = {
  vertical: 'bottom',
  horizontal: 'center',
};

const DEFAULT_COMPONENTS: SnackbarProviderProps['Components'] = {
  success: StyledSnackbar,
  error: StyledSnackbar,
  long_success: StyledLongSnackbar,
  long_error: StyledLongSnackbar,
};

const DEFAULT_ACTION: SnackbarProviderProps['action'] = (snackbarId) => (
  <SnackbarCloseButton snackbarKey={snackbarId} />
);

export function SnackbarProvider({
  anchorOrigin = DEFAULT_ANCHOR_ORIGIN,
  Components = DEFAULT_COMPONENTS,
  ...rest
}: SnackbarProviderProps) {
  return (
    <NotistackSnackbarProvider
      action={DEFAULT_ACTION}
      anchorOrigin={anchorOrigin}
      Components={Components}
      preventDuplicate
      {...rest}
    />
  );
}

export default SnackbarProvider;
