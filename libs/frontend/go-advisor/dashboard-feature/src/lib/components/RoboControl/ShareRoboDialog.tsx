import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  Typography,
  Button,
  DialogClose,
} from '@bambu/react-ui';
import { useGTMShareLinkEvent } from '@bambu/go-advisor-analytics';
import { useCallback } from 'react';

import type { DialogProps } from '@bambu/react-ui';
import { useSelectTenantUrlQuery } from '@bambu/go-advisor-core';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export interface ShareRoboDialogProps extends Pick<DialogProps, 'open'> {
  handleClose?: () => void;
}

export const ShareRoboDialog = ({
  open,
  handleClose,
}: ShareRoboDialogProps) => {
  const { data: tenantUrl } = useSelectTenantUrlQuery();
  const gtmShareLinkEvent = useGTMShareLinkEvent();
  const handleShareLinkEvent = useCallback(
    () => gtmShareLinkEvent({ url: tenantUrl as string }),
    [tenantUrl]
  );

  const copyToClipboard = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("Browser don't have support for native clipboard.");
      } else if (!tenantUrl) {
        throw new Error('Tenant URL is not available.');
      }

      await navigator.clipboard.writeText(tenantUrl);
      handleShareLinkEvent();
    } catch (error) {
      console.log(error?.toString());
    }
  };

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=Client Experience Link&body=${tenantUrl}`,
      '_blank'
    );
    handleShareLinkEvent();
  };

  const shareViaLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${tenantUrl}`,
      '_blank'
    );
    handleShareLinkEvent();
  };

  const shareViaWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?text=' + tenantUrl, '_blank');
    handleShareLinkEvent();
  };

  return (
    <Dialog open={open}>
      <Box px={3} py={2}>
        <DialogClose handleClose={handleClose} />
        <DialogTitle>Ready to share your robo?</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>
              You can either copy the unique URL or directly share it with your
              clients via email, WhatsApp, or LinkedIn.
            </Typography>
            <Box display="flex" sx={{ gap: 2 }} alignItems="center">
              <Box
                py={1}
                px={2}
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 0.5,
                  flexGrow: 1,
                })}
              >
                <Typography>{tenantUrl}</Typography>
              </Box>
              <Box>
                <Button size="large" onClick={copyToClipboard}>
                  Copy link
                </Button>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" sx={{ gap: 3 }}>
              <Typography variant="subtitle2">Share via</Typography>
              <Box display="flex" sx={{ gap: 4 }}>
                <Button
                  type="button"
                  onClick={shareViaEmail}
                  color="primary"
                  variant="text"
                  size="small"
                  startIcon={<EmailIcon />}
                  aria-label="share via email"
                >
                  Email
                </Button>
                <Button
                  type="button"
                  onClick={shareViaLinkedIn}
                  color="primary"
                  variant="text"
                  size="small"
                  startIcon={<LinkedInIcon />}
                  aria-label="share to LinkedIn"
                >
                  LinkedIn
                </Button>
                <Button
                  type="button"
                  onClick={shareViaWhatsApp}
                  color="primary"
                  variant="text"
                  size="small"
                  startIcon={<WhatsAppIcon />}
                  aria-label="share to WhatsApp"
                >
                  WhatsApp
                </Button>
              </Box>
            </Box>
            <Box p={2} bgcolor="grey.200" borderRadius={0.5}>
              <Typography>
                Please ensure that you have configured and previewed your
                robo-advisor before sharing it with your clients.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ShareRoboDialog;
