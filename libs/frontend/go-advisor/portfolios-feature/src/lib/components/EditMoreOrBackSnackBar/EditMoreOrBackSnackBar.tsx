import {
  Box,
  closeSnackbar,
  MuiLink,
  SnackbarCloseButton,
} from '@bambu/react-ui';
import type { SnackbarKey } from 'notistack';
import type { ReactNode } from 'react';

export function EditMoreOrBackSnackbar({
  snackbarId,
  title = 'Edit more portfolios',
  navigate,
}: {
  snackbarId: SnackbarKey;
  title?: ReactNode;
  // because of the way the router is set up, we need to pass in the navigate function
  // check App.tsx to see notistack is outside of the router
  navigate: (args: any) => void;
}) {
  return (
    <Box display="flex" sx={{ gap: 1 }}>
      <MuiLink
        component="button"
        onClick={() => {
          closeSnackbar(snackbarId);
          navigate(-1);
        }}
      >
        {title}
      </MuiLink>
      <MuiLink
        component="button"
        onClick={() => {
          closeSnackbar(snackbarId);
          navigate('../home');
        }}
      >
        Go to dashboard
      </MuiLink>
      <SnackbarCloseButton snackbarKey={snackbarId} />
    </Box>
  );
}
export default EditMoreOrBackSnackbar;
