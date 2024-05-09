import {
  IconButton,
  Dialog,
  Box,
  Typography,
  DialogTitle,
  DialogClose,
  DialogContent,
  Stack,
  Button,
} from '@bambu/react-ui';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';

export function QualifiedLeadsDialog() {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);

  const handleCloseDialog = () => setOpen(false);

  return (
    <>
      <IconButton
        aria-label="open qualified leads dialog"
        color="primary"
        sx={{ position: 'relative', top: -1 }}
        onClick={handleOpenDialog}
      >
        <InfoOutlinedIcon sx={{ width: 16, height: 16 }} />
      </IconButton>
      <Dialog open={open} maxWidth="sm" fullWidth>
        <Box px={2} py={3}>
          <DialogClose handleClose={handleCloseDialog} />
          <DialogTitle>Qualified Leads</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Typography>
                Bambu GO is designed to help you focus your time and energy on
                leads that meet your needs.
              </Typography>
              <Box>
                <Typography>
                  As such, we have automatically filter leads based on the
                  following criteria:
                </Typography>
                <ul>
                  <li>
                    <Typography>
                      Individuals with an annual income of $100,000 and above.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      Retirees with savings of $240,000 and above
                    </Typography>
                  </li>
                </ul>
              </Box>
              <Typography>
                We’re working on allowing you to change these numbers in the
                future
              </Typography>
              <Box>
                <Button onClick={handleCloseDialog}>Got it</Button>
              </Box>
            </Stack>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}

export default QualifiedLeadsDialog;
