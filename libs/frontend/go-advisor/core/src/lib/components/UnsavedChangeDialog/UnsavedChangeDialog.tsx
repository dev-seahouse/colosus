import {
  Box,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@bambu/react-ui';
import type { ReactNode } from 'react';
import React from 'react';
import ReactRouterPrompt from 'react-router-prompt';

type ReactRouterPromptProps = Parameters<typeof ReactRouterPrompt>[0];

export interface UnsavedChangeDialogProps {
  /* boolean or blocker function that returns a boolean indicating whether the dialog should be shown */
  when: ReactRouterPromptProps['when'];
  /* dialog title, can be a string or a ReactNode */
  title?: ReactNode;
  /* dialog content */
  children?: ReactNode;
  /* actions buttons */
  actions?: (props: {
    onCancel: UnsavedChangeDialogProps['onCancel'];
    onConfirm: UnsavedChangeDialogProps['onConfirm'];
  }) => ReactNode;
  // what to do when user cancels leaving the page
  onCancel?: () => void;
  // what to do when user confirms leaving the page
  onConfirm?: () => void;
}

const DefaultActions = ({
  onCancel,
  onConfirm,
}: Pick<UnsavedChangeDialogProps, 'onCancel' | 'onConfirm'>) => (
  <Stack direction="row" spacing={3}>
    <Button onClick={onCancel} fullWidth>
      <Typography whiteSpace={'nowrap'}>Keep editing</Typography>
    </Button>
    <Button variant="text" onClick={onConfirm} fullWidth>
      <Typography whiteSpace={'nowrap'}>Discard changes</Typography>
    </Button>
  </Stack>
);

export function UnsavedChangeDialog({
  actions,
  when,
  title = 'You have unsaved changes. Do you want to save these changes before you go?',
  children = (
    <Typography>
      All unsaved changes will be lost if you leave this page.
    </Typography>
  ),
  onConfirm: propOnConfirm,
  onCancel: propOnCancel,
}: UnsavedChangeDialogProps) {
  function handleOnCancel(rrpOnCancel: () => void) {
    return () => {
      if (typeof propOnCancel === 'function') {
        propOnCancel();
      }
      return rrpOnCancel();
    };
  }

  function handleOnConfirm(rrpOnConfirm: () => void) {
    return () => {
      if (typeof propOnConfirm === 'function') {
        propOnConfirm();
      }
      return rrpOnConfirm();
    };
  }

  const actionSlot =
    typeof actions === 'function'
      ? actions
      : ({
          onConfirm,
          onCancel,
        }: Pick<UnsavedChangeDialogProps, 'onConfirm' | 'onCancel'>) => (
          <DefaultActions onCancel={onCancel} onConfirm={onConfirm} />
        );

  return (
    <ReactRouterPrompt when={when}>
      {({ isActive, onCancel, onConfirm }) => (
        <Dialog open={isActive}>
          <Box px={0.5} py={3}>
            <DialogClose handleClose={handleOnCancel(onCancel)} />
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                {children}
                {actionSlot({
                  onCancel: handleOnCancel(onCancel),
                  onConfirm: handleOnConfirm(onConfirm),
                })}
              </Stack>
            </DialogContent>
          </Box>
        </Dialog>
      )}
    </ReactRouterPrompt>
  );
}

export default UnsavedChangeDialog;
