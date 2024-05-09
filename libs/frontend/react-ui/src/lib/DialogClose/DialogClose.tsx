import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface DialogCloseProps {
  handleClose?: () => void;
}

export function DialogClose({ handleClose }: DialogCloseProps) {
  return (
    <Box display="flex" justifyContent="flex-end">
      <IconButton aria-label="close-dialog" onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
}

export default DialogClose;
