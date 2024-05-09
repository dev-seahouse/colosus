import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  DialogActions,
  DialogClose,
} from '@bambu/react-ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';

export interface LeadsDetailsDialogProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

// TODO: move this into bambu ui ?
export function LeadsDetailsDialog({
  title,
  description,
  children,
}: LeadsDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);

  const handleCloseDialog = () => setOpen(false);

  return (
    <>
      <IconButton
        onClick={handleOpenDialog}
        aria-label={`open ${title} dialog`}
        color="primary"
        size="small"
      >
        <InfoOutlinedIcon />
      </IconButton>
      <Dialog maxWidth="sm" fullWidth open={open}>
        <Box px={2} py={3}>
          <DialogClose handleClose={handleCloseDialog} />
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle2">{description}</Typography>
            {children}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Got it</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default LeadsDetailsDialog;
