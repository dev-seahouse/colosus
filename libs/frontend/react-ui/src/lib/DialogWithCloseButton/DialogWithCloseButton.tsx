import React from 'react';
import type { DialogProps, SxProps } from '../../index';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '../../index';
import CloseIcon from '@mui/icons-material/Close';

export interface DialogWithCloseButtonProps extends DialogProps {
  onClose: () => void;
  // the dialog title, required by accessibility (aria-labelledby)
  dialogTitle: React.ReactNode;
  // the dialog title aria-id
  dialogTitleId: string;
  // dialog description aria-id
  dialogDescriptionId: string;
  // the main content
  children: React.ReactNode;
  // the action buttons, default to OK button to close dialog
  actions?: React.ReactNode;

  contentWrapperStyles?: SxProps;
}

const DefaultAction = ({
  onClose,
}: {
  onClose: DialogWithCloseButtonProps['onClose'];
}) => (
  <Box py={3}>
    <Button onClick={onClose}>OK</Button>
  </Box>
);

export function DialogWithCloseButton({
  children,
  open,
  dialogTitle,
  dialogTitleId,
  dialogDescriptionId,
  actions,
  onClose,
  contentWrapperStyles,
  ...props
}: DialogWithCloseButtonProps) {
  const actionSlot = React.isValidElement(actions) ? (
    actions
  ) : (
    <DefaultAction onClose={onClose} />
  );

  return (
    <Dialog
      aria-labelledby={dialogTitleId}
      aira-describedby={dialogDescriptionId}
      open={open}
      {...props}
    >
      <Box sx={contentWrapperStyles}>
        <Box display={'flex'} justifyContent={'flex-end'} px={1} pt={1} pb={0}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[800],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogTitle id="direct-debit-guarantee-dialg-title" fontWeight={700}>
          {dialogTitle}
        </DialogTitle>
        <DialogContent id={dialogDescriptionId}>
          {children}
          {actionSlot}
        </DialogContent>
      </Box>
    </Dialog>
  );
}

export default DialogWithCloseButton;
