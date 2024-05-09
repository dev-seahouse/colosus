import { UnsavedChangeDialog } from '@bambu/go-advisor-core';
import { Box, Button, Stack, Typography } from '@bambu/react-ui';

export function OpenInvestAccountFormUnsavedChangeDialog({
  when,
}: {
  when: boolean;
}) {
  return (
    <UnsavedChangeDialog
      title={
        <Typography component="h1" fontWeight={'bold'} fontSize={'22px'}>
          You have unsaved changes
        </Typography>
      }
      when={when}
      actions={({ onConfirm, onCancel }) => {
        return (
          <Stack direction="row" spacing={3}>
            <Button variant={'outlined'} onClick={onConfirm} fullWidth>
              <Typography whiteSpace={'nowrap'}>Leave page</Typography>
            </Button>
            <Button variant="contained" onClick={onCancel} fullWidth>
              <Typography whiteSpace={'nowrap'}>Keep editing</Typography>
            </Button>
          </Stack>
        );
      }}
    >
      <Box>
        You have unsaved changes for your Investment account opening form. Are
        you sure do you want to close this page?
      </Box>
    </UnsavedChangeDialog>
  );
}

export default OpenInvestAccountFormUnsavedChangeDialog;
